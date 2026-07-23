const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all academic years for the current school
 * @route   GET /api/management/academic-years
 * @access  Private (Principal, Administrator)
 */
exports.getAcademicYears = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const academicYears = await prisma.academicYear.findMany({
    where: { schoolId },
    orderBy: { startDate: "desc" },
  });

  res.status(200).json({
    status: "success",
    results: academicYears.length,
    data: academicYears,
  });
});

/**
 * @desc    Create a new academic year
 * @route   POST /api/management/academic-years
 * @access  Private (Principal)
 */
exports.createAcademicYear = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const { name, startDate, endDate, isCurrent } = req.body;

  const existingYear = await prisma.academicYear.findUnique({
    where: {
      schoolId_name: {
        schoolId,
        name,
      },
    },
  });

  if (existingYear) {
    throw new ApiError("يوجد سنة دراسية بهذا الاسم في هذه المدرسة.", 400);
  }

  if (isCurrent) {
    await prisma.academicYear.updateMany({
      where: { schoolId },
      data: { isCurrent: false },
    });
  }

  const academicYear = await prisma.academicYear.create({
    data: {
      schoolId,
      name,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isCurrent: isCurrent || false,
    },
  });

  res.status(201).json({
    status: "success",
    data: academicYear,
  });
});

/**
 * @desc    Update an academic year
 * @route   PUT /api/management/academic-years/:id
 * @access  Private (Principal)
 */
exports.updateAcademicYear = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const yearId = parseInt(req.params.id, 10);
  const { name, startDate, endDate, isCurrent } = req.body;

  const year = await prisma.academicYear.findFirst({
    where: { id: yearId, schoolId },
  });

  if (!year) {
    throw new ApiError("السنة الدراسية غير موجودة.", 404);
  }

  if (name && name !== year.name) {
    const existingYear = await prisma.academicYear.findUnique({
      where: {
        schoolId_name: { schoolId, name },
      },
    });

    if (existingYear) {
      throw new ApiError("يوجد سنة دراسية بهذا الاسم في هذه المدرسة.", 400);
    }
  }

  if (isCurrent && !year.isCurrent) {
    await prisma.academicYear.updateMany({
      where: { schoolId },
      data: { isCurrent: false },
    });
  }

  const updatedYear = await prisma.academicYear.update({
    where: { id: yearId },
    data: {
      name: name || year.name,
      startDate: startDate ? new Date(startDate) : year.startDate,
      endDate: endDate ? new Date(endDate) : year.endDate,
      isCurrent: isCurrent !== undefined ? isCurrent : year.isCurrent,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedYear,
  });
});

/**
 * @desc    Set academic year as current
 * @route   PATCH /api/management/academic-years/:id/set-current
 * @access  Private (Principal)
 */
exports.setCurrentAcademicYear = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const yearId = parseInt(req.params.id, 10);

  const year = await prisma.academicYear.findFirst({
    where: { id: yearId, schoolId },
  });

  if (!year) {
    throw new ApiError("السنة الدراسية غير موجودة.", 404);
  }

  await prisma.academicYear.updateMany({
    where: { schoolId },
    data: { isCurrent: false },
  });

  const updatedYear = await prisma.academicYear.update({
    where: { id: yearId },
    data: { isCurrent: true },
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث السنة الحالية بنجاح.",
    data: updatedYear,
  });
});

/**
 * @desc    Delete an academic year
 * @route   DELETE /api/management/academic-years/:id
 * @access  Private (Principal)
 */
exports.deleteAcademicYear = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;
  const yearId = parseInt(req.params.id, 10);

  const year = await prisma.academicYear.findFirst({
    where: { id: yearId, schoolId },
    include: {
      schoolClasses: true,
      studentEnrollments: true,
    }
  });

  if (!year) {
    throw new ApiError("السنة الدراسية غير موجودة.", 404);
  }

  if (year.schoolClasses.length > 0 || year.studentEnrollments.length > 0) {
    throw new ApiError("لا يمكن حذف السنة الدراسية لأنها مرتبطة بصفوف أو تسجيلات طلاب.", 400);
  }

  await prisma.academicYear.delete({
    where: { id: yearId },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف السنة الدراسية بنجاح.",
  });
});
