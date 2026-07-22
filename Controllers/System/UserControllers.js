const asyncHandler = require("express-async-handler");
const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");



/// ============================================================
// GET /api/management/users
// ============================================================
const getUsers = asyncHandler(async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const role = req.query.role;
  const schoolId = req.query.schoolId;

  const where = {};

  if (schoolId) {
    where.schoolId = parseInt(schoolId);
  }

  if (role) {
    const validRoles = ["SUPER_ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT", "ADMINISTRATOR"];
    if (!validRoles.includes(role)) {
      throw new ApiError("قيمة الصلاحية (role) غير صالحة للبحث", 400);
    }
    where.role = role;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      {
        student: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } },
          ]
        }
      },
      {
        teacher: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } },
          ]
        }
      },
      {
        staffMember: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } },
          ]
        }
      },
      {
        parent: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } },
          ]
        }
      }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        school: { select: { nameAr: true, nameEn: true } },
        student: { select: { firstNameAr: true, lastNameAr: true } },
        teacher: { select: { firstNameAr: true, lastNameAr: true } },
        staffMember: { select: { firstNameAr: true, lastNameAr: true } },
        parent: { select: { firstNameAr: true, lastNameAr: true } }
      }
    }),
    prisma.user.count({ where }),
  ]);

  const safeUsers = users.map(user => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  });

  res.status(200).json({
    status: "success",
    results: safeUsers.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: { users: safeUsers },
  });
});

/// ============================================================
// GET /api/management/users/:id
// ============================================================
const getUserById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const where = { id: parseInt(id) };

  const user = await prisma.user.findFirst({
    where,
    include: {
      school: true,
      student: true,
      teacher: true,
      staffMember: true,
      parent: true
    }
  });

  if (!user) {
    throw new ApiError("المستخدم غير موجود أو لا تملك صلاحية الوصول إليه", 404);
  }

  const { passwordHash, ...safeUser } = user;

  res.status(200).json({
    status: "success",
    data: { user: safeUser },
  });
});

/// ============================================================
// POST /api/system/users/principal
// ============================================================
const createPrincipal = asyncHandler(async (req, res) => {

  const {
    email, password, phone, schoolId, isActive,
    firstNameAr, lastNameAr, firstNameEn, lastNameEn, isEmailVerified
  } = req.body;

  const role = "PRINCIPAL";

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        phone ? { phone } : undefined
      ].filter(Boolean)
    }
  });

  if (existingUser) {
    throw new ApiError("البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        phone: phone || null,
        schoolId,
        isEmailVerified,
        isActive: isActive !== undefined ? isActive : true
      },
    });

    const staffMember = await tx.staffMember.create({
      data: {
        userId: user.id,
        employeeCode: `EMP-${Date.now()}`,
        firstNameAr,
        lastNameAr,
        firstNameEn: firstNameEn || null,
        lastNameEn: lastNameEn || null,
        position: "مدير مدرسة", // ثابت للمدير
      }
    });

    return { user, staffMember };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(201).json({
    status: "success",
    message: "تم إنشاء حساب مدير المدرسة بنجاح",
    data: {
      user: safeUser,
      profile: result.staffMember
    },
  });
});

/// ============================================================
// PUT /api/system/users/principal/:id
// ============================================================
const updatePrincipal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const userToUpdate = await prisma.user.findFirst({
    where: { id: parseInt(id) },
    include: { staffMember: true }
  });

  if (!userToUpdate) {
    throw new ApiError("المستخدم غير موجود أو لا تملك صلاحية تعديله", 404);
  }

  let {
    email, password, phone, schoolId, isActive,
    firstNameAr, lastNameAr, firstNameEn, lastNameEn
  } = req.body;

  if (email || phone) {
    const existingUser = await prisma.user.findFirst({
      where: {
        id: { not: parseInt(id) },
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      throw new ApiError("البريد الإلكتروني أو رقم الهاتف مستخدم من قبل حساب آخر", 400);
    }
  }

  let hashedPassword = userToUpdate.passwordHash;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: parseInt(id) },
      data: {
        email: email || undefined,
        passwordHash: hashedPassword,
        phone: phone !== undefined ? phone : undefined,
        schoolId: schoolId !== undefined ? (schoolId || null) : userToUpdate.schoolId,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    let staffMember = null;
    if (userToUpdate.staffMember) {
      staffMember = await tx.staffMember.update({
        where: { userId: user.id },
        data: {
          firstNameAr: firstNameAr || undefined,
          lastNameAr: lastNameAr || undefined,
          firstNameEn: firstNameEn !== undefined ? firstNameEn : undefined,
          lastNameEn: lastNameEn !== undefined ? lastNameEn : undefined,
        }
      });
    }

    return { user, staffMember };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(200).json({
    status: "success",
    message: "تم تحديث حساب مدير المدرسة بنجاح",
    data: {
      user: safeUser,
      profile: result.staffMember
    },
  });
});

/// ============================================================
// DELETE /api/system/users/principal/:id
// ============================================================
const deletePrincipal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const userToDelete = await prisma.user.findFirst({
    where: { id: parseInt(id) }
  });

  if (!userToDelete) {
    throw new ApiError("المستخدم غير موجود أو لا تملك صلاحية حذفه", 404);
  }

  if (userToDelete.id === req.user.userId) {
    throw new ApiError("لا يمكنك حذف حسابك الخاص!", 400);
  }

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
});

module.exports = {
  getUsers,
  getUserById,
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
};
