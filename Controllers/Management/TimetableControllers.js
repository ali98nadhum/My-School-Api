const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");


const handlePrismaConflictError = (err) => {
  if (err.code === "P2002") {
    const msg = err.message.toLowerCase();
    const isTeacher = msg.includes("teacher_id") || msg.includes("teacherid");
    const isSection = msg.includes("section_id") || msg.includes("sectionid");

    if (isTeacher) {
      return new ApiError("يوجد تعارض: هذا المعلم يقوم بتدريس شعبة أخرى في نفس اليوم ونفس الحصة.", 409);
    }
    if (isSection) {
      return new ApiError("يوجد تعارض: هذه الشعبة لديها مادة أخرى في نفس اليوم ونفس الحصة.", 409);
    }
    return new ApiError("تعارض في البيانات.", 409);
  }
  return null;
};


const verifyEntitiesOwnership = async (schoolId, { sectionId, subjectId, teacherId, academicYearId }) => {
  if (academicYearId) {
    const academicYear = await prisma.academicYear.findFirst({ where: { id: academicYearId, schoolId } });
    if (!academicYear) throw new ApiError("السنة الدراسية غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  if (sectionId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, schoolClass: { academicYear: { schoolId } } }
    });
    if (!section) throw new ApiError("الشعبة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  if (subjectId) {
    const subject = await prisma.subject.findFirst({ where: { id: subjectId } });
    if (!subject) throw new ApiError("المادة غير موجودة.", 404);
  }

  if (teacherId) {
    const teacher = await prisma.teacher.findFirst({ where: { id: teacherId, user: { schoolId } } });
    if (!teacher) throw new ApiError("المعلم غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }
};

/**
 * @desc    Get timetable entries with filters
 * @route   GET /api/management/timetables
 * @access  Private
 */
exports.getTimetableEntries = asyncHandler(async (req, res, next) => {
  const { sectionId, teacherId, dayOfWeek, academicYearId, page = 1, limit = 20 } = req.query;
  const schoolId = req.user.schoolId;

  const where = {
    section: { schoolClass: { academicYear: { schoolId } } }
  };

  if (sectionId) where.sectionId = parseInt(sectionId, 10);
  if (teacherId) where.teacherId = parseInt(teacherId, 10);
  if (dayOfWeek) where.dayOfWeek = dayOfWeek;
  if (academicYearId) where.academicYearId = parseInt(academicYearId, 10);

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  const [total, entries] = await Promise.all([
    prisma.timetableEntry.count({ where }),
    prisma.timetableEntry.findMany({
      where,
      skip,
      take,
      include: {
        section: { select: { id: true, name: true, schoolClass: { select: { nameAr: true } } } },
        subject: { select: { id: true, nameAr: true } },
        teacher: { select: { id: true, firstNameAr: true, lastNameAr: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true } }
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { period: { sortOrder: "asc" } }
      ]
    })
  ]);

  res.status(200).json({
    status: "success",
    results: entries.length,
    pagination: { total, page: parseInt(page, 10), limit: take },
    data: entries
  });
});

/**
 * @desc    Create a single timetable entry
 * @route   POST /api/management/timetables
 * @access  Private (Principal, Administrator)
 */
exports.createTimetableEntry = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const data = req.body;

  await verifyEntitiesOwnership(schoolId, data);

  try {
    const entry = await prisma.timetableEntry.create({
      data: {
        sectionId: data.sectionId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        periodId: data.periodId,
        dayOfWeek: data.dayOfWeek,
        room: data.room || null,
        academicYearId: data.academicYearId
      }
    });

    res.status(201).json({ status: "success", data: entry });
  } catch (error) {
    const conflictError = handlePrismaConflictError(error);
    if (conflictError) return next(conflictError);
    throw error;
  }
});

/**
 * @desc    Batch create timetable entries
 * @route   POST /api/management/timetables/batch
 * @access  Private (Principal, Administrator)
 */
exports.batchCreateTimetableEntries = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { entries } = req.body;

  if (entries.length > 0) {
    await verifyEntitiesOwnership(schoolId, entries[0]);
  }

  try {
    const createdEntries = await prisma.$transaction(
      entries.map(data => prisma.timetableEntry.create({ data }))
    );

    res.status(201).json({
      status: "success",
      message: `تم إنشاء ${createdEntries.length} حصة بنجاح.`
    });
  } catch (error) {
    const conflictError = handlePrismaConflictError(error);
    if (conflictError) return next(conflictError);
    throw error;
  }
});

/**
 * @desc    Update a timetable entry
 * @route   PUT /api/management/timetables/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateTimetableEntry = asyncHandler(async (req, res, next) => {
  const entryId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const data = req.body;

  const existingEntry = await prisma.timetableEntry.findFirst({
    where: { id: entryId, section: { schoolClass: { academicYear: { schoolId } } } }
  });

  if (!existingEntry) {
    throw new ApiError("الحصة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  await verifyEntitiesOwnership(schoolId, data);

  try {
    const updatedEntry = await prisma.timetableEntry.update({
      where: { id: entryId },
      data
    });

    res.status(200).json({ status: "success", data: updatedEntry });
  } catch (error) {
    const conflictError = handlePrismaConflictError(error);
    if (conflictError) return next(conflictError);
    throw error;
  }
});

/**
 * @desc    Delete a timetable entry
 * @route   DELETE /api/management/timetables/:id
 * @access  Private (Principal, Administrator)
 */
exports.deleteTimetableEntry = asyncHandler(async (req, res, next) => {
  const entryId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const existingEntry = await prisma.timetableEntry.findFirst({
    where: { id: entryId, section: { schoolClass: { academicYear: { schoolId } } } }
  });

  if (!existingEntry) {
    throw new ApiError("الحصة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  await prisma.timetableEntry.delete({ where: { id: entryId } });

  res.status(204).json({ status: "success", data: null });
});

/**
 * @desc    Get timetable entry by ID
 * @route   GET /api/management/timetables/:id
 * @access  Private
 */
exports.getTimetableEntryById = asyncHandler(async (req, res, next) => {
  const entryId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const entry = await prisma.timetableEntry.findFirst({
    where: { id: entryId, section: { schoolClass: { academicYear: { schoolId } } } },
    include: {
      section: true,
      subject: true,
      teacher: true,
      period: true
    }
  });

  if (!entry) throw new ApiError("الحصة غير موجودة.", 404);

  res.status(200).json({ status: "success", data: entry });
});
