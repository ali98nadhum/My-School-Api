const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");

exports.createExam = asyncHandler(async (req, res, next) => {
  const { academicYearId, examTypeId, subjectId, sectionId, examDate, maxScore, passingScore } = req.body;
  const teacherUserId = req.user.id;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUserId }
  });

  if (!teacher) {
    throw new ApiError("حساب المعلم غير موجود", 404);
  }

  const schoolId = teacher.schoolId;

  // Validate Academic Year belongs to this school
  const academicYear = await prisma.academicYear.findFirst({
    where: { id: academicYearId, schoolId }
  });
  if (!academicYear) throw new ApiError("السنة الدراسية غير موجودة", 404);

  // Validate Exam Type
  const examType = await prisma.examType.findUnique({ where: { id: examTypeId } });
  if (!examType) throw new ApiError("نوع الامتحان غير موجود", 404);

  // Validate Subject and check if this teacher teaches it in this section
  const sectionSubjectTeacher = await prisma.sectionSubjectTeacher.findFirst({
    where: { teacherId: teacher.id, subjectId, sectionId }
  });
  
  if (!sectionSubjectTeacher) {
    throw new ApiError("أنت لا تدرس هذه المادة لهذه الشعبة، غير مصرح لك بإنشاء امتحان", 403);
  }

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
    throw new ApiError("لقد قمت بإنشاء هذا الامتحان مسبقاً لهذه الشعبة", 400);
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
      createdBy: teacherUserId
    }
  });

  res.status(201).json({
    status: "success",
    data: newExam
  });
});

exports.getTeacherExams = asyncHandler(async (req, res, next) => {
  const { academicYearId, sectionId, subjectId, examTypeId } = req.query;
  const teacherUserId = req.user.id;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUserId }
  });

  if (!teacher) {
    throw new ApiError("حساب المعلم غير موجود", 404);
  }

  const where = {
    createdBy: teacherUserId
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
      section: { select: { name: true, schoolClass: { select: { nameAr: true } } } }
    },
    orderBy: { examDate: "desc" }
  });

  res.status(200).json({
    status: "success",
    results: exams.length,
    data: exams
  });
});

exports.updateExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { examDate, maxScore, passingScore } = req.body;
  const teacherUserId = req.user.id;

  let exam = await prisma.exam.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!exam) {
    throw new ApiError("الامتحان غير موجود", 404);
  }

  if (exam.createdBy !== teacherUserId) {
    throw new ApiError("غير مصرح لك بتعديل هذا الامتحان لأنك لم تقم بإنشائه", 403);
  }

  exam = await prisma.exam.update({
    where: { id: parseInt(id, 10) },
    data: {
      examDate: examDate ? new Date(examDate) : exam.examDate,
      maxScore: maxScore !== undefined ? maxScore : exam.maxScore,
      passingScore: passingScore !== undefined ? passingScore : exam.passingScore
    }
  });

  res.status(200).json({
    status: "success",
    data: exam
  });
});

exports.deleteExam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const teacherUserId = req.user.id;

  const exam = await prisma.exam.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!exam) {
    throw new ApiError("الامتحان غير موجود", 404);
  }

  if (exam.createdBy !== teacherUserId) {
    throw new ApiError("غير مصرح لك بحذف هذا الامتحان لأنك لم تقم بإنشائه", 403);
  }

  await prisma.exam.delete({
    where: { id: parseInt(id, 10) }
  });

  res.status(204).send();
});
