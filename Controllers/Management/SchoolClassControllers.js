const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all school classes for a specific academic year
 * @route   GET /api/management/classes?academicYearId=...
 * @access  Private (Principal, Administrator)
 */
exports.getSchoolClasses = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { academicYearId } = req.query;

  const where = {};

  if (academicYearId) {
    where.academicYearId = parseInt(academicYearId, 10);
  }

  where.academicYear = {
    schoolId: schoolId
  };

  const schoolClasses = await prisma.schoolClass.findMany({
    where,
    include: {
      gradeLevel: true,
      academicYear: true,
    },
    orderBy: {
      gradeLevel: { sortOrder: "asc" }
    }
  });

  res.status(200).json({
    status: "success",
    results: schoolClasses.length,
    data: schoolClasses,
  });
});

/**
 * @desc    Get a specific school class by ID
 * @route   GET /api/management/classes/:id
 * @access  Private (Principal, Administrator)
 */
exports.getSchoolClassById = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const classId = parseInt(req.params.id, 10);

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: classId,
      academicYear: { schoolId }
    },
    include: {
      gradeLevel: true,
      academicYear: true,
      sections: true,
    }
  });

  if (!schoolClass) {
    throw new ApiError("الصف غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: schoolClass,
  });
});

/**
 * @desc    Create a new school class
 * @route   POST /api/management/classes
 * @access  Private (Principal, Administrator)
 */
exports.createSchoolClass = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { gradeLevelId, academicYearId, nameEn, nameAr } = req.body;

  // 1. التحقق من أن السنة الدراسية موجودة وتابعة للمدرسة
  const academicYear = await prisma.academicYear.findFirst({
    where: { id: academicYearId, schoolId }
  });

  if (!academicYear) {
    throw new ApiError("السنة الدراسية غير موجودة أو لا تنتمي لهذه المدرسة.", 404);
  }

  // 2. التحقق من أن المرحلة الدراسية موجودة
  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id: gradeLevelId }
  });

  if (!gradeLevel) {
    throw new ApiError("المرحلة الدراسية غير موجودة.", 404);
  }

  const existingClass = await prisma.schoolClass.findUnique({
    where: {
      gradeLevelId_academicYearId: {
        gradeLevelId,
        academicYearId
      }
    }
  });

  if (existingClass) {
    throw new ApiError("يوجد صف لهذه المرحلة في نفس السنة الدراسية.", 400);
  }

  const schoolClass = await prisma.schoolClass.create({
    data: {
      gradeLevelId,
      academicYearId,
      nameEn: nameEn || gradeLevel.nameEn,
      nameAr: nameAr || gradeLevel.nameAr,
    },
    include: {
      gradeLevel: true,
    }
  });

  res.status(201).json({
    status: "success",
    data: schoolClass,
  });
});

/**
 * @desc    Update a school class
 * @route   PUT /api/management/classes/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateSchoolClass = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const classId = parseInt(req.params.id, 10);
  const { nameEn, nameAr } = req.body;

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: classId,
      academicYear: { schoolId }
    }
  });

  if (!schoolClass) {
    throw new ApiError("الصف غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  const updatedClass = await prisma.schoolClass.update({
    where: { id: classId },
    data: {
      nameEn: nameEn || schoolClass.nameEn,
      nameAr: nameAr || schoolClass.nameAr,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedClass,
  });
});

/**
 * @desc    Delete a school class
 * @route   DELETE /api/management/classes/:id
 * @access  Private (Principal)
 */
exports.deleteSchoolClass = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const classId = parseInt(req.params.id, 10);

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: classId,
      academicYear: { schoolId }
    },
    include: {
      sections: true,
    }
  });

  if (!schoolClass) {
    throw new ApiError("الصف غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  if (schoolClass.sections.length > 0) {
    throw new ApiError("لا يمكن حذف الصف لأن هناك شعب دراسية (Sections) تابعة له.", 400);
  }

  await prisma.schoolClass.delete({
    where: { id: classId },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف الصف بنجاح.",
  });
});
