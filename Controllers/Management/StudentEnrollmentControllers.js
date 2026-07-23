const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");


const checkSectionCapacity = async (sectionId) => {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { _count: { select: { studentEnrollments: { where: { status: "ACTIVE" } } } } }
  });

  if (!section) throw new ApiError("الشعبة غير موجودة.", 404);

  if (section._count.studentEnrollments >= section.capacity) {
    throw new ApiError(`الشعبة ممتلئة. السعة القصوى هي ${section.capacity} طلاب.`, 400);
  }
  return section;
};


const syncStudentCurrentSection = async (tx, studentId) => {
  const latestEnrollment = await tx.studentEnrollment.findFirst({
    where: { studentId, status: "ACTIVE" },
    orderBy: { enrollmentDate: "desc" }
  });

  await tx.student.update({
    where: { id: studentId },
    data: { currentSectionId: latestEnrollment ? latestEnrollment.sectionId : null }
  });
};

/**
 * @desc    Get all student enrollments with pagination and filters
 * @route   GET /api/management/enrollments
 * @access  Private (Principal, Administrator)
 */
exports.getEnrollments = asyncHandler(async (req, res, next) => {
  const { studentId, classId, sectionId, status, page = 1, limit = 10 } = req.query;
  const schoolId = req.user.schoolId;

  const where = {
    student: { schoolId }
  };

  if (studentId) where.studentId = parseInt(studentId, 10);
  if (classId) where.classId = parseInt(classId, 10);
  if (sectionId) where.sectionId = parseInt(sectionId, 10);
  if (status) where.status = status;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [enrollments, total] = await Promise.all([
    prisma.studentEnrollment.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        student: { select: { id: true, firstNameAr: true, lastNameAr: true, studentCode: true } },
        schoolClass: { select: { id: true, nameAr: true, academicYear: { select: { name: true } }, gradeLevel: { select: { nameAr: true } } } },
        section: { select: { id: true, name: true } }
      },
      orderBy: { enrollmentDate: "desc" }
    }),
    prisma.studentEnrollment.count({ where })
  ]);

  res.status(200).json({
    status: "success",
    results: enrollments.length,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    },
    data: enrollments,
  });
});

/**
 * @desc    Get specific enrollment by ID
 * @route   GET /api/management/enrollments/:id
 * @access  Private (Principal, Administrator)
 */
exports.getEnrollmentById = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { id, student: { schoolId } },
    include: {
      student: true,
      schoolClass: { include: { academicYear: true, gradeLevel: true } },
      section: true
    }
  });

  if (!enrollment) {
    throw new ApiError("سجل التسجيل غير موجود.", 404);
  }

  res.status(200).json({
    status: "success",
    data: enrollment,
  });
});

/**
 * @desc    Enroll a student (Create new enrollment)
 * @route   POST /api/management/enrollments
 * @access  Private (Principal, Administrator)
 */
exports.enrollStudent = asyncHandler(async (req, res, next) => {
  const { studentId, classId, sectionId, enrollmentDate, status } = req.body;
  const schoolId = req.user.schoolId;

  const student = await prisma.student.findFirst({ where: { id: studentId, schoolId } });
  if (!student) throw new ApiError("الطالب غير موجود أو لا ينتمي لهذه المدرسة.", 404);

  const schoolClass = await prisma.schoolClass.findFirst({
    where: { id: classId, academicYear: { schoolId } }
  });
  if (!schoolClass) throw new ApiError("الصف الدراسي غير موجود.", 404);

  const existingEnrollment = await prisma.studentEnrollment.findUnique({
    where: { studentId_classId: { studentId, classId } }
  });
  if (existingEnrollment) {
    throw new ApiError("الطالب مسجل بالفعل في هذا الصف وهذه السنة الدراسية.", 400);
  }

  if (sectionId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, classId }
    });
    if (!section) throw new ApiError("الشعبة المحددة غير صحيحة أو لا تنتمي لهذا الصف.", 400);

    await checkSectionCapacity(sectionId);
  }

  await prisma.$transaction(async (tx) => {
    const newEnrollment = await tx.studentEnrollment.create({
      data: {
        studentId,
        classId,
        sectionId: sectionId || null,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
        status: status || "ACTIVE"
      }
    });

    await syncStudentCurrentSection(tx, studentId);
  });

  res.status(201).json({
    status: "success",
    message: "تم تسجيل الطالب بنجاح."
  });
});

/**
 * @desc    Assign student to a section (when they have none)
 * @route   PUT /api/management/enrollments/:id/assign-section
 * @access  Private
 */
exports.assignStudentSection = asyncHandler(async (req, res, next) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const { sectionId } = req.body;
  const schoolId = req.user.schoolId;

  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { id: enrollmentId, student: { schoolId } }
  });

  if (!enrollment) throw new ApiError("سجل التسجيل غير موجود.", 404);
  if (enrollment.sectionId) throw new ApiError("الطالب مسجل بالفعل في شعبة، استخدم النقل بدلاً من ذلك.", 400);

  const section = await prisma.section.findFirst({
    where: { id: sectionId, classId: enrollment.classId }
  });

  if (!section) throw new ApiError("الشعبة غير متوافقة مع صف الطالب.", 400);

  await checkSectionCapacity(sectionId);

  await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.update({
      where: { id: enrollmentId },
      data: { sectionId }
    });
    await syncStudentCurrentSection(tx, enrollment.studentId);
  });

  res.status(200).json({ status: "success", message: "تم تعيين الطالب في الشعبة بنجاح." });
});

/**
 * @desc    Transfer student to a different section
 * @route   PUT /api/management/enrollments/:id/transfer
 * @access  Private (Principal, Administrator)
 */
exports.transferStudentSection = asyncHandler(async (req, res, next) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const { newSectionId } = req.body;
  const schoolId = req.user.schoolId;

  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { id: enrollmentId, student: { schoolId } }
  });

  if (!enrollment) throw new ApiError("سجل التسجيل غير موجود.", 404);

  if (enrollment.sectionId === newSectionId) {
    throw new ApiError("الطالب مسجل بالفعل في هذه الشعبة.", 400);
  }

  const newSection = await prisma.section.findFirst({
    where: { id: newSectionId, classId: enrollment.classId }
  });

  if (!newSection) {
    throw new ApiError("الشعبة الجديدة غير متوافقة مع الصف الدراسي الحالي.", 400);
  }

  await checkSectionCapacity(newSectionId);

  await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.update({
      where: { id: enrollmentId },
      data: { sectionId: newSectionId }
    });

    await syncStudentCurrentSection(tx, enrollment.studentId);
  });

  res.status(200).json({
    status: "success",
    message: "تم نقل الطالب للشعبة الجديدة بنجاح."
  });
});

/**
 * @desc    Remove student from section (keep enrollment but clear section)
 * @route   PUT /api/management/enrollments/:id/remove-section
 * @access  Private (Principal, Administrator)
 */
exports.removeStudentFromSection = asyncHandler(async (req, res, next) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { id: enrollmentId, student: { schoolId } }
  });

  if (!enrollment) throw new ApiError("سجل التسجيل غير موجود.", 404);

  if (!enrollment.sectionId) {
    throw new ApiError("الطالب غير مسجل في أي شعبة حالياً.", 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.update({
      where: { id: enrollmentId },
      data: { sectionId: null }
    });

    await syncStudentCurrentSection(tx, enrollment.studentId);
  });

  res.status(200).json({
    status: "success",
    message: "تم إزالة الطالب من الشعبة بنجاح."
  });
});

/**
 * @desc    Update enrollment status
 * @route   PUT /api/management/enrollments/:id/status
 * @access  Private (Principal, Administrator)
 */
exports.updateEnrollmentStatus = asyncHandler(async (req, res, next) => {
  const enrollmentId = parseInt(req.params.id, 10);
  const { status } = req.body;
  const schoolId = req.user.schoolId;

  const enrollment = await prisma.studentEnrollment.findFirst({
    where: { id: enrollmentId, student: { schoolId } }
  });

  if (!enrollment) throw new ApiError("سجل التسجيل غير موجود.", 404);

  await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.update({
      where: { id: enrollmentId },
      data: { status }
    });

    await syncStudentCurrentSection(tx, enrollment.studentId);
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث حالة التسجيل بنجاح."
  });
});
