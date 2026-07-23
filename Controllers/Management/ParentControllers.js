const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * @desc    Get all parents with pagination and filters
 * @route   GET /api/management/parents
 * @access  Private (Principal, Administrator)
 */
exports.getParents = asyncHandler(async (req, res, next) => {
  const { search, occupation, isActive, page = 1, limit = 10 } = req.query;
  const schoolId = req.user.schoolId;

  const where = {
    user: {
      schoolId: schoolId,
      role: "PARENT"
    }
  };

  if (isActive !== undefined) {
    where.user.isActive = isActive === "true";
  }

  if (occupation) {
    where.occupation = { contains: occupation, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { firstNameAr: { contains: search, mode: "insensitive" } },
      { lastNameAr: { contains: search, mode: "insensitive" } },
      { nationalId: { contains: search, mode: "insensitive" } },
      { phonePrimary: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } }
    ];
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [parents, total] = await Promise.all([
    prisma.parent.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        user: {
          select: { email: true, isActive: true, createdAt: true }
        },
        studentGuardians: {
          include: {
            student: { select: { id: true, firstNameAr: true, lastNameAr: true, studentCode: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.parent.count({ where })
  ]);

  res.status(200).json({
    status: "success",
    results: parents.length,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    },
    data: parents,
  });
});

/**
 * @desc    Get specific parent details
 * @route   GET /api/management/parents/:id
 * @access  Private (Principal, Administrator)
 */
exports.getParentById = asyncHandler(async (req, res, next) => {
  const parentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const parent = await prisma.parent.findFirst({
    where: {
      id: parentId,
      user: { schoolId }
    },
    include: {
      user: {
        select: { email: true, isActive: true, createdAt: true }
      },
      studentGuardians: {
        include: {
          student: true
        }
      }
    }
  });

  if (!parent) {
    throw new ApiError("ولي الأمر غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: parent,
  });
});

/**
 * @desc    Create a new parent
 * @route   POST /api/management/parents
 * @access  Private (Principal, Administrator)
 */
exports.createParent = asyncHandler(async (req, res, next) => {
  const {
    password, phonePrimary, phoneSecondary, firstNameAr, lastNameAr,
    firstNameEn, lastNameEn, nationalId, occupation, address, isActive
  } = req.body;
  const schoolId = req.user.schoolId;

  const email = req.body.email || `parent_${phonePrimary}@no-email.local`;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { phone: phonePrimary }
      ]
    }
  });

  if (existingUser) {
    throw new ApiError("البريد الإلكتروني أو رقم الهاتف الأساسي مسجل مسبقاً في النظام.", 400);
  }

  if (nationalId) {
    const existingNationalId = await prisma.parent.findUnique({ where: { nationalId } });
    if (existingNationalId) {
      throw new ApiError("الرقم الوطني مسجل مسبقاً لولي أمر آخر.", 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: "PARENT",
        phone: phonePrimary,
        schoolId,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    const parent = await tx.parent.create({
      data: {
        userId: user.id,
        firstNameAr,
        lastNameAr,
        firstNameEn: firstNameEn || null,
        lastNameEn: lastNameEn || null,
        nationalId: nationalId || null,
        occupation: occupation || null,
        phonePrimary,
        phoneSecondary: phoneSecondary || null,
        address: address || null,
      }
    });

    return { user, parent };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(201).json({
    status: "success",
    message: "تم إضافة ولي الأمر بنجاح",
    data: {
      user: safeUser,
      profile: result.parent
    }
  });
});

/**
 * @desc    Update a parent
 * @route   PUT /api/management/parents/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateParent = asyncHandler(async (req, res, next) => {
  const parentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const {
    email, password, phonePrimary, phoneSecondary, firstNameAr, lastNameAr,
    firstNameEn, lastNameEn, nationalId, occupation, address, isActive
  } = req.body;

  const parent = await prisma.parent.findFirst({
    where: {
      id: parentId,
      user: { schoolId }
    },
    include: { user: true }
  });

  if (!parent) {
    throw new ApiError("ولي الأمر غير موجود.", 404);
  }

  if (email && email !== parent.user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ApiError("البريد الإلكتروني مستخدم لحساب آخر.", 400);
  }

  if (phonePrimary && phonePrimary !== parent.phonePrimary) {
    const exists = await prisma.user.findFirst({ where: { phone: phonePrimary } });
    if (exists) throw new ApiError("رقم الهاتف مستخدم لحساب آخر.", 400);
  }

  if (nationalId && nationalId !== parent.nationalId) {
    const exists = await prisma.parent.findUnique({ where: { nationalId } });
    if (exists) throw new ApiError("الرقم الوطني مستخدم لولي أمر آخر.", 400);
  }

  let updatedPassword = parent.user.passwordHash;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatedPassword = await bcrypt.hash(password, salt);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: parent.userId },
      data: {
        email: email || parent.user.email,
        phone: phonePrimary !== undefined ? phonePrimary : parent.user.phone,
        passwordHash: updatedPassword,
        isActive: isActive !== undefined ? isActive : parent.user.isActive,
      }
    });

    const updatedProfile = await tx.parent.update({
      where: { id: parentId },
      data: {
        firstNameAr: firstNameAr || parent.firstNameAr,
        lastNameAr: lastNameAr || parent.lastNameAr,
        firstNameEn: firstNameEn !== undefined ? firstNameEn : parent.firstNameEn,
        lastNameEn: lastNameEn !== undefined ? lastNameEn : parent.lastNameEn,
        nationalId: nationalId !== undefined ? nationalId : parent.nationalId,
        occupation: occupation !== undefined ? occupation : parent.occupation,
        phonePrimary: phonePrimary || parent.phonePrimary,
        phoneSecondary: phoneSecondary !== undefined ? phoneSecondary : parent.phoneSecondary,
        address: address !== undefined ? address : parent.address,
      }
    });

    return { user: updatedUser, profile: updatedProfile };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(200).json({
    status: "success",
    message: "تم تحديث بيانات ولي الأمر بنجاح",
    data: {
      user: safeUser,
      profile: result.profile
    }
  });
});

/**
 * @desc    Link parent to a student (max 4 parents per student)
 * @route   POST /api/management/parents/:id/students
 * @access  Private (Principal, Administrator)
 */
exports.linkStudent = asyncHandler(async (req, res, next) => {
  const parentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const { studentId, relationshipType, isPrimaryContact, canPickup, financialResponsible } = req.body;

  const parent = await prisma.parent.findFirst({
    where: { id: parentId, user: { schoolId } }
  });

  if (!parent) {
    throw new ApiError("ولي الأمر غير موجود.", 404);
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, schoolId },
    include: { studentGuardians: true }
  });

  if (!student) {
    const checkStudent = await prisma.student.findUnique({ where: { id: studentId }, include: { studentGuardians: true } });
    if (!checkStudent) throw new ApiError("الطالب غير موجود.", 404);
  }

  const targetStudent = student || await prisma.student.findUnique({ where: { id: studentId }, include: { studentGuardians: true } });

  const isAlreadyLinked = targetStudent.studentGuardians.some(g => g.parentId === parentId);
  if (isAlreadyLinked) {
    throw new ApiError("هذا الطالب مرتبط بالفعل بولي الأمر الحالي.", 400);
  }

  if (targetStudent.studentGuardians.length >= 4) {
    throw new ApiError("لا يمكن ربط الطالب بأكثر من 4 أولياء أمور كحد أقصى.", 400);
  }

  const guardian = await prisma.studentGuardian.create({
    data: {
      studentId,
      parentId,
      relationshipType: relationshipType || null,
      isPrimaryContact,
      canPickup,
      financialResponsible
    }
  });

  res.status(201).json({
    status: "success",
    message: "تم ربط الطالب بولي الأمر بنجاح.",
    data: guardian
  });
});

/**
 * @desc    Unlink student from parent (must retain at least 1 parent)
 * @route   DELETE /api/management/parents/:id/students/:studentId
 * @access  Private (Principal, Administrator)
 */
exports.unlinkStudent = asyncHandler(async (req, res, next) => {
  const parentId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.params.studentId, 10);
  const schoolId = req.user.schoolId;

  const parent = await prisma.parent.findFirst({
    where: { id: parentId, user: { schoolId } }
  });

  if (!parent) {
    throw new ApiError("ولي الأمر غير موجود.", 404);
  }

  const guardians = await prisma.studentGuardian.findMany({
    where: { studentId }
  });

  const linkExists = guardians.find(g => g.parentId === parentId);
  if (!linkExists) {
    throw new ApiError("لا يوجد ارتباط بين ولي الأمر وهذا الطالب.", 404);
  }

  if (guardians.length === 1) {
    throw new ApiError("لا يمكن إزالة هذا الارتباط، يجب أن يمتلك الطالب ولي أمر واحد على الأقل في النظام.", 400);
  }

  await prisma.studentGuardian.delete({
    where: { id: linkExists.id }
  });

  res.status(200).json({
    status: "success",
    message: "تم إلغاء ربط الطالب بولي الأمر بنجاح."
  });
});

/**
 * @desc    Delete a parent
 * @route   DELETE /api/management/parents/:id
 * @access  Private (Principal)
 */
exports.deleteParent = asyncHandler(async (req, res, next) => {
  const parentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const parent = await prisma.parent.findFirst({
    where: { id: parentId, user: { schoolId } },
    include: { studentGuardians: { include: { student: { include: { studentGuardians: true } } } } }
  });

  if (!parent) {
    throw new ApiError("ولي الأمر غير موجود.", 404);
  }

  for (const guardian of parent.studentGuardians) {
    if (guardian.student.studentGuardians.length === 1) {
      throw new ApiError(`لا يمكن حذف ولي الأمر لأنه الولي الوحيد للطالب (${guardian.student.firstNameAr}). يجب إضافة ولي أمر بديل للطالب أولاً.`, 400);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentGuardian.deleteMany({ where: { parentId } });
    await tx.parent.delete({ where: { id: parentId } });
    await tx.user.delete({ where: { id: parent.userId } });
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف ولي الأمر بنجاح."
  });
});
