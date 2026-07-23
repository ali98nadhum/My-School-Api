const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * @desc    Get all teachers with pagination and filters
 * @route   GET /api/management/teachers
 * @access  Private (Principal, Administrator)
 */
exports.getTeachers = asyncHandler(async (req, res, next) => {
  const { search, specialization, isActive, page = 1, limit = 10 } = req.query;
  const schoolId = req.user.schoolId;

  const where = {
    user: {
      schoolId: schoolId,
      role: "TEACHER"
    }
  };

  if (isActive !== undefined) {
    where.user.isActive = isActive === "true";
  }

  if (specialization) {
    where.specialization = { contains: specialization, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { firstNameAr: { contains: search, mode: "insensitive" } },
      { lastNameAr: { contains: search, mode: "insensitive" } },
      { firstNameEn: { contains: search, mode: "insensitive" } },
      { lastNameEn: { contains: search, mode: "insensitive" } },
      { employeeCode: { contains: search, mode: "insensitive" } },
      { user: { phone: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } }
    ];
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        user: {
          select: { email: true, phone: true, isActive: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.teacher.count({ where })
  ]);

  res.status(200).json({
    status: "success",
    results: teachers.length,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    },
    data: teachers,
  });
});

/**
 * @desc    Get specific teacher details
 * @route   GET /api/management/teachers/:id
 * @access  Private (Principal, Administrator)
 */
exports.getTeacherById = asyncHandler(async (req, res, next) => {
  const teacherId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      user: { schoolId }
    },
    include: {
      user: {
        select: { email: true, phone: true, isActive: true, createdAt: true }
      },
      sectionSubjectTeachers: {
        include: {
          section: {
            include: { schoolClass: { include: { gradeLevel: true } } }
          },
          subject: true,
          academicYear: true
        }
      },
      homeroomSections: {
        include: { schoolClass: true }
      }
    }
  });

  if (!teacher) {
    throw new ApiError("المعلم غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: teacher,
  });
});

/**
 * @desc    Create a new teacher
 * @route   POST /api/management/teachers
 * @access  Private (Principal, Administrator)
 */
exports.createTeacher = asyncHandler(async (req, res, next) => {
  const {
    email, password, phone, firstNameAr, lastNameAr,
    firstNameEn, lastNameEn, qualification, specialization, isActive
  } = req.body;
  const schoolId = req.user.schoolId;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        phone ? { phone } : undefined
      ].filter(Boolean)
    }
  });

  if (existingUser) {
    throw new ApiError("البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً في النظام.", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: "TEACHER",
        phone: phone || null,
        schoolId,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    const teacher = await tx.teacher.create({
      data: {
        userId: user.id,
        employeeCode: `TCH-${Date.now().toString().slice(-6)}`,
        firstNameAr,
        lastNameAr,
        firstNameEn: firstNameEn || null,
        lastNameEn: lastNameEn || null,
        qualification: qualification || null,
        specialization: specialization || null,
      }
    });

    return { user, teacher };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(201).json({
    status: "success",
    message: "تم إضافة المعلم بنجاح",
    data: {
      user: safeUser,
      profile: result.teacher
    }
  });
});

/**
 * @desc    Update a teacher
 * @route   PUT /api/management/teachers/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const {
    email, password, phone, firstNameAr, lastNameAr,
    firstNameEn, lastNameEn, qualification, specialization, isActive
  } = req.body;

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      user: { schoolId }
    },
    include: { user: true }
  });

  if (!teacher) {
    throw new ApiError("المعلم غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  if (email && email !== teacher.user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ApiError("البريد الإلكتروني مستخدم لحساب آخر.", 400);
  }

  if (phone && phone !== teacher.user.phone) {
    const exists = await prisma.user.findFirst({ where: { phone } });
    if (exists) throw new ApiError("رقم الهاتف مستخدم لحساب آخر.", 400);
  }

  let updatedPassword = teacher.user.passwordHash;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedPassword = await bcrypt.hash(password, salt);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: teacher.userId },
      data: {
        email: email || teacher.user.email,
        phone: phone !== undefined ? phone : teacher.user.phone,
        passwordHash: updatedPassword,
        isActive: isActive !== undefined ? isActive : teacher.user.isActive,
      }
    });

    const updatedProfile = await tx.teacher.update({
      where: { id: teacherId },
      data: {
        firstNameAr: firstNameAr || teacher.firstNameAr,
        lastNameAr: lastNameAr || teacher.lastNameAr,
        firstNameEn: firstNameEn !== undefined ? firstNameEn : teacher.firstNameEn,
        lastNameEn: lastNameEn !== undefined ? lastNameEn : teacher.lastNameEn,
        qualification: qualification !== undefined ? qualification : teacher.qualification,
        specialization: specialization !== undefined ? specialization : teacher.specialization,
      }
    });

    return { user: updatedUser, profile: updatedProfile };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(200).json({
    status: "success",
    message: "تم تحديث بيانات المعلم بنجاح",
    data: {
      user: safeUser,
      profile: result.profile
    }
  });
});

/**
 * @desc    Assign teacher to a subject in a specific section
 * @route   POST /api/management/teachers/:id/assignments
 * @access  Private (Principal, Administrator)
 */
exports.assignTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const { sectionId, subjectId, academicYearId } = req.body;

  const teacher = await prisma.teacher.findFirst({
    where: { id: teacherId, user: { schoolId } }
  });

  if (!teacher) {
    throw new ApiError("المعلم غير موجود.", 404);
  }

  const existingAssignment = await prisma.sectionSubjectTeacher.findUnique({
    where: {
      sectionId_subjectId_academicYearId: { sectionId, subjectId, academicYearId }
    }
  });

  if (existingAssignment) {
    throw new ApiError("يوجد معلم مُعيّن بالفعل لهذه المادة في هذه الشعبة والسنة الدراسية المحددة.", 400);
  }

  const assignment = await prisma.sectionSubjectTeacher.create({
    data: { sectionId, subjectId, academicYearId, teacherId }
  });

  res.status(201).json({
    status: "success",
    message: "تم تعيين المعلم بنجاح.",
    data: assignment
  });
});

/**
 * @desc    Delete a teacher
 * @route   DELETE /api/management/teachers/:id
 * @access  Private (Principal)
 */
exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const teacherId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const teacher = await prisma.teacher.findFirst({
    where: { id: teacherId, user: { schoolId } },
    include: {
      sectionSubjectTeachers: true,
      timetableEntries: true,
      homeroomSections: true,
    }
  });

  if (!teacher) {
    throw new ApiError("المعلم غير موجود.", 404);
  }

  if (
    teacher.sectionSubjectTeachers.length > 0 ||
    teacher.timetableEntries.length > 0 ||
    teacher.homeroomSections.length > 0
  ) {
    throw new ApiError("لا يمكن حذف هذا المعلم لوجود جداول أو مواد أو شعب مرتبطة به.", 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.teacher.delete({ where: { id: teacherId } });
    await tx.user.delete({ where: { id: teacher.userId } });
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف المعلم بنجاح."
  });
});
