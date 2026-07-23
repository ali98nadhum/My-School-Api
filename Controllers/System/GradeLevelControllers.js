const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all grade levels
 * @route   GET /api/system/grade-levels
 * @access  Private (SuperAdmin, Principal, Administrator)
 */
exports.getGradeLevels = asyncHandler(async (req, res, next) => {
  const gradeLevels = await prisma.gradeLevel.findMany({
    orderBy: { sortOrder: "asc" },
  });

  res.status(200).json({
    status: "success",
    results: gradeLevels.length,
    data: gradeLevels,
  });
});

/**
 * @desc    Get a specific grade level
 * @route   GET /api/system/grade-levels/:id
 * @access  Private (SuperAdmin, Principal, Administrator)
 */
exports.getGradeLevelById = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id },
  });

  if (!gradeLevel) {
    throw new ApiError("المرحلة الدراسية غير موجودة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: gradeLevel,
  });
});

/**
 * @desc    Create a new grade level
 * @route   POST /api/system/grade-levels
 * @access  Private (SuperAdmin)
 */
exports.createGradeLevel = asyncHandler(async (req, res, next) => {
  const { nameEn, nameAr, sortOrder } = req.body;

  const existingOrder = await prisma.gradeLevel.findUnique({
    where: { sortOrder },
  });

  if (existingOrder) {
    throw new ApiError("يوجد مرحلة دراسية أخرى تستخدم نفس هذا الترتيب.", 400);
  }

  const gradeLevel = await prisma.gradeLevel.create({
    data: {
      nameEn,
      nameAr,
      sortOrder,
    },
  });

  res.status(201).json({
    status: "success",
    data: gradeLevel,
  });
});

/**
 * @desc    Update a grade level
 * @route   PUT /api/system/grade-levels/:id
 * @access  Private (SuperAdmin)
 */
exports.updateGradeLevel = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { nameEn, nameAr, sortOrder } = req.body;

  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id },
  });

  if (!gradeLevel) {
    throw new ApiError("المرحلة الدراسية غير موجودة.", 404);
  }

  // التحقق من عدم تكرار الترتيب إذا تم تعديله
  if (sortOrder && sortOrder !== gradeLevel.sortOrder) {
    const existingOrder = await prisma.gradeLevel.findUnique({
      where: { sortOrder },
    });

    if (existingOrder) {
      throw new ApiError("يوجد مرحلة دراسية أخرى تستخدم نفس هذا الترتيب.", 400);
    }
  }

  const updatedGradeLevel = await prisma.gradeLevel.update({
    where: { id },
    data: {
      nameEn: nameEn || gradeLevel.nameEn,
      nameAr: nameAr || gradeLevel.nameAr,
      sortOrder: sortOrder !== undefined ? sortOrder : gradeLevel.sortOrder,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedGradeLevel,
  });
});

/**
 * @desc    Delete a grade level
 * @route   DELETE /api/system/grade-levels/:id
 * @access  Private (SuperAdmin)
 */
exports.deleteGradeLevel = asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  const gradeLevel = await prisma.gradeLevel.findUnique({
    where: { id },
    include: {
      schoolClasses: true,
      feeStructures: true,
    }
  });

  if (!gradeLevel) {
    throw new ApiError("المرحلة الدراسية غير موجودة.", 404);
  }

  if (gradeLevel.schoolClasses.length > 0 || gradeLevel.feeStructures.length > 0) {
    throw new ApiError("لا يمكن حذف المرحلة الدراسية لأنها مرتبطة بصفوف أو هياكل رسوم.", 400);
  }

  await prisma.gradeLevel.delete({
    where: { id },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف المرحلة الدراسية بنجاح.",
  });
});
