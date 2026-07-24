const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

// ==========================================
// Exam Types (Management)
// ==========================================

exports.createExamType = asyncHandler(async (req, res, next) => {
  const { nameAr, nameEn, weightPercentage } = req.body;

  const examType = await prisma.examType.create({
    data: {
      nameAr,
      nameEn,
      weightPercentage: weightPercentage || 0,
    }
  });

  res.status(201).json({
    status: "success",
    data: examType
  });
});

exports.getExamTypes = asyncHandler(async (req, res, next) => {
  const examTypes = await prisma.examType.findMany();

  res.status(200).json({
    status: "success",
    results: examTypes.length,
    data: examTypes
  });
});

exports.updateExamType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { nameAr, nameEn, weightPercentage } = req.body;

  let examType = await prisma.examType.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!examType) {
    throw new ApiError("نوع الامتحان غير موجود", 404);
  }

  examType = await prisma.examType.update({
    where: { id: parseInt(id, 10) },
    data: {
      nameAr: nameAr || examType.nameAr,
      nameEn: nameEn || examType.nameEn,
      weightPercentage: weightPercentage !== undefined ? weightPercentage : examType.weightPercentage,
    }
  });

  res.status(200).json({
    status: "success",
    data: examType
  });
});

// ==========================================
// Exams (Management)
// ==========================================

exports.createExam = asyncHandler(async (req, res, next) => {
  const { academicYearId, examTypeId, subjectId, sectionId, examDate, maxScore, passingScore } = req.body;
  const schoolId = req.user.schoolId;

  // Validate Academic Year belongs to this school
  const academicYear = await prisma.academicYear.findFirst({
    where: { id: academicYearId, schoolId }
  });
  if (!academicYear) throw new ApiError("السنة الدراسية غير موجودة أو لا تنتمي لهذه المدرسة", 404);

  // Validate Exam Type
  const examType = await prisma.examType.findUnique({ where: { id: examTypeId } });
  if (!examType) throw new ApiError("نوع الامتحان غير موجود", 404);

  // Validate Section
  const section = await prisma.section.findFirst({
    where: { id: sectionId, schoolClass: { academicYear: { schoolId } } },
    include: { schoolClass: true }
  });
  if (!section) throw new ApiError("الشعبة غير موجودة في هذه المدرسة", 404);

  // Validate Subject
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId }
  });
  if (!subject) throw new ApiError("المادة غير موجودة", 404);

  // Check unique constraint
  const existingExam = await prisma.exam.findUnique({
    where: {
      academicYearId_examTypeId_subjectId_sectionId: {
        academicYearId,
        examTypeId,
        subjectId,
        sectionId
      }
    }
  });
  if (existingExam) {
    throw new ApiError("تم إنشاء هذا الامتحان مسبقاً لهذه الشعبة والمادة.", 400);
  }

  const newExam = await prisma.exam.create({
    data: {
      academicYearId,
      examTypeId,
      subjectId,
      sectionId,
      examDate: examDate ? new Date(examDate) : null,
      maxScore: maxScore || 100,
      passingScore: passingScore || 50,
      createdBy: req.user.id
    }
  });

  res.status(201).json({
    status: "success",
    data: newExam
  });
});

exports.getExams = asyncHandler(async (req, res, next) => {
  const { academicYearId, sectionId, subjectId, examTypeId } = req.query;
  const schoolId = req.user.schoolId;

  const where = {
    academicYear: { schoolId }
  };

  if (academicYearId) where.academicYearId = parseInt(academicYearId, 10);
  if (sectionId) where.sectionId = parseInt(sectionId, 10);
  if (subjectId) where.subjectId = parseInt(subjectId, 10);
  if (examTypeId) where.examTypeId = parseInt(examTypeId, 10);

  const exams = await prisma.exam.findMany({
    where,
    include: {
      examType: true,
      subject: { select: { nameAr: true, nameEn: true } },
      section: { select: { name: true, schoolClass: { select: { nameAr: true } } } },
      createdByUser: { select: { firstNameAr: true, lastNameAr: true } }
    },
    orderBy: { examDate: "desc" }
  });

  res.status(200).json({
    status: "success",
    results: exams.length,
    data: exams
  });
});
