const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all sections (optionally filter by classId)
 * @route   GET /api/management/sections
 * @access  Private (Principal, Administrator)
 */
exports.getSections = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { classId } = req.query;

  const where = {
    schoolClass: {
      academicYear: { schoolId }
    }
  };

  if (classId) {
    where.classId = parseInt(classId, 10);
  }

  const sections = await prisma.section.findMany({
    where,
    include: {
      schoolClass: {
        include: { gradeLevel: true, academicYear: true }
      },
      homeroomTeacher: {
        include: { user: { select: { email: true } } }
      }
    },
    orderBy: { name: "asc" }
  });

  res.status(200).json({
    status: "success",
    results: sections.length,
    data: sections,
  });
});

/**
 * @desc    Get a specific section by ID
 * @route   GET /api/management/sections/:id
 * @access  Private (Principal, Administrator)
 */
exports.getSectionById = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const sectionId = parseInt(req.params.id, 10);

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolClass: {
        academicYear: { schoolId }
      }
    },
    include: {
      schoolClass: {
        include: { gradeLevel: true, academicYear: true }
      },
      homeroomTeacher: true,
      students: true, // اختياري لعرض الطلاب المسجلين
    }
  });

  if (!section) {
    throw new ApiError("الشعبة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: section,
  });
});

/**
 * @desc    Create a new section
 * @route   POST /api/management/sections
 * @access  Private (Principal, Administrator)
 */
exports.createSection = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { classId, name, capacity, homeroomTeacherId } = req.body;

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: classId,
      academicYear: { schoolId }
    }
  });

  if (!schoolClass) {
    throw new ApiError("الصف غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  const existingSection = await prisma.section.findUnique({
    where: {
      classId_name: { classId, name }
    }
  });

  if (existingSection) {
    throw new ApiError("يوجد شعبة بنفس الاسم في هذا الصف.", 400);
  }

  if (homeroomTeacherId) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        id: homeroomTeacherId,
        user: { schoolId }
      }
    });

    if (!teacher) {
      throw new ApiError("المعلم غير موجود أو لا ينتمي لهذه المدرسة.", 404);
    }
  }

  const section = await prisma.section.create({
    data: {
      classId,
      name,
      capacity: capacity || 30,
      homeroomTeacherId: homeroomTeacherId || null,
    },
    include: {
      homeroomTeacher: true,
    }
  });

  res.status(201).json({
    status: "success",
    data: section,
  });
});

/**
 * @desc    Update a section
 * @route   PUT /api/management/sections/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateSection = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const sectionId = parseInt(req.params.id, 10);
  const { name, capacity, homeroomTeacherId } = req.body;

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolClass: {
        academicYear: { schoolId }
      }
    }
  });

  if (!section) {
    throw new ApiError("الشعبة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  if (name && name !== section.name) {
    const existingSection = await prisma.section.findUnique({
      where: {
        classId_name: { classId: section.classId, name }
      }
    });

    if (existingSection) {
      throw new ApiError("يوجد شعبة بنفس الاسم في هذا الصف.", 400);
    }
  }

  if (homeroomTeacherId) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        id: homeroomTeacherId,
        user: { schoolId }
      }
    });

    if (!teacher) {
      throw new ApiError("المعلم غير موجود أو لا ينتمي لهذه المدرسة.", 404);
    }
  }

  const updatedSection = await prisma.section.update({
    where: { id: sectionId },
    data: {
      name: name || section.name,
      capacity: capacity !== undefined ? capacity : section.capacity,
      homeroomTeacherId: homeroomTeacherId !== undefined ? homeroomTeacherId : section.homeroomTeacherId,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedSection,
  });
});

/**
 * @desc    Delete a section
 * @route   DELETE /api/management/sections/:id
 * @access  Private (Principal)
 */
exports.deleteSection = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const sectionId = parseInt(req.params.id, 10);

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolClass: {
        academicYear: { schoolId }
      }
    },
    include: {
      students: true,
      sectionSubjectTeachers: true,
      timetableEntries: true,
    }
  });

  if (!section) {
    throw new ApiError("الشعبة غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  if (section.students.length > 0 || section.sectionSubjectTeachers.length > 0 || section.timetableEntries.length > 0) {
    throw new ApiError("لا يمكن حذف الشعبة لوجود طلاب أو جداول أو معلمين مرتبطين بها.", 400);
  }

  await prisma.section.delete({
    where: { id: sectionId },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف الشعبة بنجاح.",
  });
});
