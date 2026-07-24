const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");
const { prisma } = require("../../config/prismaClient");

/**
 * ------------------------------------------------------------------
 * Fee Type Controllers
 * ------------------------------------------------------------------
 */

/**
 * @desc    Create a new fee type
 * @route   POST /api/management/fees/types
 * @access  Private (Principal, Administrator)
 */
exports.createFeeType = asyncHandler(async (req, res, next) => {
  const { nameEn, nameAr, description } = req.body;

  const feeType = await prisma.feeType.create({
    data: { nameEn, nameAr, description }
  });

  res.status(201).json({
    status: "success",
    message: "تم إنشاء نوع الرسم بنجاح",
    data: feeType
  });
});

/**
 * @desc    Get all fee types
 * @route   GET /api/management/fees/types
 * @access  Private (Principal, Administrator)
 */
exports.getFeeTypes = asyncHandler(async (req, res, next) => {
  const feeTypes = await prisma.feeType.findMany({
    orderBy: { id: "asc" }
  });

  res.status(200).json({
    status: "success",
    results: feeTypes.length,
    data: feeTypes
  });
});

/**
 * @desc    Update a fee type
 * @route   PUT /api/management/fees/types/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateFeeType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { nameEn, nameAr, description } = req.body;

  const existingFeeType = await prisma.feeType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingFeeType) {
    return next(new ApiError("نوع الرسم غير موجود", 404));
  }

  const updatedFeeType = await prisma.feeType.update({
    where: { id: parseInt(id) },
    data: { nameEn, nameAr, description }
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث نوع الرسم بنجاح",
    data: updatedFeeType
  });
});

/**
 * @desc    Delete a fee type
 * @route   DELETE /api/management/fees/types/:id
 * @access  Private (Principal, Administrator)
 */
exports.deleteFeeType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const feeType = await prisma.feeType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!feeType) {
    return next(new ApiError("نوع الرسم غير موجود", 404));
  }

  // Check if fee type is used in any fee structure
  const relatedStructure = await prisma.feeStructure.findFirst({
    where: { feeTypeId: parseInt(id) }
  });

  if (relatedStructure) {
    return next(new ApiError("لا يمكن حذف هذا الرسم لارتباطه بهيكلية رسوم دراسية. قم بحذف ارتباطه أولاً.", 400));
  }

  await prisma.feeType.delete({
    where: { id: parseInt(id) }
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف نوع الرسم بنجاح"
  });
});

/**
 * ------------------------------------------------------------------
 * Fee Structure Controllers
 * ------------------------------------------------------------------
 */

/**
 * @desc    Create a new fee structure
 * @route   POST /api/management/fees/structure
 * @access  Private (Principal, Administrator)
 */
exports.createFeeStructure = asyncHandler(async (req, res, next) => {
  const { gradeLevelId, academicYearId, feeTypeId, amount } = req.body;

  // Verify related entities exist
  const gradeLevel = await prisma.gradeLevel.findUnique({ where: { id: gradeLevelId } });
  if (!gradeLevel) return next(new ApiError("الصف الدراسي غير موجود", 404));

  const academicYear = await prisma.academicYear.findUnique({ where: { id: academicYearId } });
  if (!academicYear) return next(new ApiError("السنة الدراسية غير موجودة", 404));

  const feeType = await prisma.feeType.findUnique({ where: { id: feeTypeId } });
  if (!feeType) return next(new ApiError("نوع الرسم غير موجود", 404));

  // Check uniqueness
  const existingStructure = await prisma.feeStructure.findFirst({
    where: { gradeLevelId, academicYearId, feeTypeId }
  });

  if (existingStructure) {
    return next(new ApiError("هذا الرسم تمت إضافته مسبقاً لهذا الصف في نفس السنة الدراسية", 400));
  }

  const feeStructure = await prisma.feeStructure.create({
    data: { gradeLevelId, academicYearId, feeTypeId, amount }
  });

  res.status(201).json({
    status: "success",
    message: "تم إنشاء هيكل الرسم بنجاح",
    data: feeStructure
  });
});

/**
 * @desc    Get all fee structures
 * @route   GET /api/management/fees/structure
 * @access  Private (Principal, Administrator)
 */
exports.getFeeStructures = asyncHandler(async (req, res, next) => {
  const { academicYearId, gradeLevelId } = req.query;

  const where = {};
  if (academicYearId) where.academicYearId = parseInt(academicYearId);
  if (gradeLevelId) where.gradeLevelId = parseInt(gradeLevelId);

  const feeStructures = await prisma.feeStructure.findMany({
    where,
    include: {
      gradeLevel: true,
      academicYear: true,
      feeType: true
    },
    orderBy: [
      { academicYearId: "desc" },
      { gradeLevelId: "asc" }
    ]
  });

  res.status(200).json({
    status: "success",
    results: feeStructures.length,
    data: feeStructures
  });
});

/**
 * @desc    Update a fee structure (amount)
 * @route   PUT /api/management/fees/structure/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateFeeStructure = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  const existingStructure = await prisma.feeStructure.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingStructure) {
    return next(new ApiError("هيكلية الرسم غير موجودة", 404));
  }

  const updatedFeeStructure = await prisma.feeStructure.update({
    where: { id: parseInt(id) },
    data: { amount }
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث هيكلية الرسم بنجاح",
    data: updatedFeeStructure
  });
});

/**
 * @desc    Delete a fee structure
 * @route   DELETE /api/management/fees/structure/:id
 * @access  Private (Principal, Administrator)
 */
exports.deleteFeeStructure = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const existingStructure = await prisma.feeStructure.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingStructure) {
    return next(new ApiError("هيكلية الرسم غير موجودة", 404));
  }

  await prisma.feeStructure.delete({
    where: { id: parseInt(id) }
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف هيكلية الرسم بنجاح"
  });
});
