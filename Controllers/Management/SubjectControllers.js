const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all subjects
 * @route   GET /api/management/subjects
 * @access  Private (Principal, Administrator)
 */
exports.getSubjects = asyncHandler(async (req, res, next) => {
  const { isActive, search, classId, page = 1, limit = 10 } = req.query;
  const where = {};

  if (isActive !== undefined) {
    where.isActive = isActive === "true";
  }


  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { nameEn: { contains: search, mode: 'insensitive' } },
      { nameAr: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (classId) {
    where.sectionSubjectTeachers = {
      some: {
        section: {
          classId: parseInt(classId, 10)
        }
      }
    };
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { nameAr: "asc" }
    }),
    prisma.subject.count({ where })
  ]);

  res.status(200).json({
    status: "success",
    results: subjects.length,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    },
    data: subjects,
  });
});

/**
 * @desc    Get a specific subject by ID
 * @route   GET /api/management/subjects/:id
 * @access  Private (Principal, Administrator)
 */
exports.getSubjectById = asyncHandler(async (req, res, next) => {
  const subjectId = parseInt(req.params.id, 10);

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    throw new ApiError("المادة الدراسية غير موجودة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: subject,
  });
});

/**
 * @desc    Create a new subject
 * @route   POST /api/management/subjects
 * @access  Private (Principal, Administrator)
 */
exports.createSubject = asyncHandler(async (req, res, next) => {
  const { code, nameEn, nameAr, isActive } = req.body;

  const existingSubject = await prisma.subject.findUnique({
    where: { code }
  });

  if (existingSubject) {
    throw new ApiError(`يوجد مادة دراسية أخرى مسجلة بنفس الرمز (${code}). يرجى اختيار رمز مختلف.`, 400);
  }

  const subject = await prisma.subject.create({
    data: {
      code,
      nameEn,
      nameAr,
      isActive: isActive !== undefined ? isActive : true,
    },
  });

  res.status(201).json({
    status: "success",
    data: subject,
  });
});

/**
 * @desc    Update a subject
 * @route   PUT /api/management/subjects/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateSubject = asyncHandler(async (req, res, next) => {
  const subjectId = parseInt(req.params.id, 10);
  const { code, nameEn, nameAr, isActive } = req.body;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId }
  });

  if (!subject) {
    throw new ApiError("المادة الدراسية غير موجودة.", 404);
  }

  if (code && code !== subject.code) {
    const existingSubject = await prisma.subject.findUnique({
      where: { code }
    });

    if (existingSubject) {
      throw new ApiError(`الرمز (${code}) مستخدم لمادة دراسية أخرى.`, 400);
    }
  }

  const updatedSubject = await prisma.subject.update({
    where: { id: subjectId },
    data: {
      code: code || subject.code,
      nameEn: nameEn !== undefined ? nameEn : subject.nameEn,
      nameAr: nameAr !== undefined ? nameAr : subject.nameAr,
      isActive: isActive !== undefined ? isActive : subject.isActive,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedSubject,
  });
});

/**
 * @desc    Delete a subject
 * @route   DELETE /api/management/subjects/:id
 * @access  Private (Principal)
 */
exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subjectId = parseInt(req.params.id, 10);

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sectionSubjectTeachers: true,
      timetableEntries: true,
      exams: true,
      lessons: true,
      homeworks: true,
    }
  });

  if (!subject) {
    throw new ApiError("المادة الدراسية غير موجودة.", 404);
  }

  if (
    subject.sectionSubjectTeachers.length > 0 ||
    subject.timetableEntries.length > 0 ||
    subject.exams.length > 0 ||
    subject.lessons.length > 0 ||
    subject.homeworks.length > 0
  ) {
    throw new ApiError("لا يمكن حذف هذه المادة لارتباطها بشعب، جداول، امتحانات، أو واجبات في النظام.", 400);
  }

  await prisma.subject.delete({
    where: { id: subjectId },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف المادة الدراسية بنجاح.",
  });
});
