const asyncHandler = require("express-async-handler");
const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");

/// ============================================================
// GET /api/management/staff
// ============================================================
const getStaff = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const role = req.query.role; // TEACHER, ADMINISTRATOR, ACCOUNTANT

  const schoolId = req.user.schoolId;

  if (!schoolId) {
    throw new ApiError("المستخدم الحالي غير مرتبط بمدرسة", 400);
  }

  const where = {
    schoolId: schoolId,
    role: { in: ["TEACHER", "ADMINISTRATOR", "ACCOUNTANT", "PRINCIPAL"] }
  };

  if (role) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      {
        teacher: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } }
          ]
        }
      },
      {
        staffMember: {
          OR: [
            { firstNameAr: { contains: search, mode: "insensitive" } },
            { lastNameAr: { contains: search, mode: "insensitive" } },
            { firstNameEn: { contains: search, mode: "insensitive" } },
            { lastNameEn: { contains: search, mode: "insensitive" } }
          ]
        }
      }
    ];
  }

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    include: {
      staffMember: true,
      teacher: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.user.count({ where });

  const formattedStaff = users.map(user => {
    const { passwordHash: _, staffMember, teacher, ...safeUser } = user;
    const profile = staffMember || teacher;
    return {
      ...safeUser,
      profile
    };
  });

  res.status(200).json({
    status: "success",
    results: formattedStaff.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: { staff: formattedStaff },
  });
});

/// ============================================================
// Helper Function for Creation
// ============================================================
const createStaffMember = async (req, res, role, position) => {
  const {
    email, password, phone, isActive, isEmailVerified,
    firstNameAr, lastNameAr, firstNameEn, lastNameEn,
    qualification, specialization
  } = req.body;

  const schoolId = req.user.schoolId;

  if (!schoolId) {
    throw new ApiError("المستخدم الحالي غير مرتبط بمدرسة", 400);
  }

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

    let profile = null;

    if (role === "TEACHER") {
      profile = await tx.teacher.create({
        data: {
          userId: user.id,
          employeeCode: `TCH-${Date.now()}`,
          firstNameAr,
          lastNameAr,
          firstNameEn: firstNameEn || null,
          lastNameEn: lastNameEn || null,
          qualification: qualification || null,
          specialization: specialization || null,
        }
      });
    } else {
      profile = await tx.staffMember.create({
        data: {
          userId: user.id,
          employeeCode: `STF-${Date.now()}`,
          firstNameAr,
          lastNameAr,
          firstNameEn: firstNameEn || null,
          lastNameEn: lastNameEn || null,
          position: position,
        }
      });
    }

    return { user, profile };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(201).json({
    status: "success",
    message: "تم إضافة الموظف بنجاح",
    data: {
      user: safeUser,
      profile: result.profile
    },
  });
};

/// ============================================================
// POST /api/management/staff/administrator
// ============================================================
const addAdministrator = asyncHandler(async (req, res) => {
  await createStaffMember(req, res, "ADMINISTRATOR", "إداري");
});

/// ============================================================
// POST /api/management/staff/accountant
// ============================================================
const addAccountant = asyncHandler(async (req, res) => {
  await createStaffMember(req, res, "ACCOUNTANT", "محاسب");
});

/// ============================================================
// POST /api/management/staff/teacher
// ============================================================
const addTeacher = asyncHandler(async (req, res) => {
  await createStaffMember(req, res, "TEACHER", "معلم");
});

/// ============================================================
// PUT /api/management/staff/:id
// ============================================================
const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const schoolId = req.user.schoolId;

  const userToUpdate = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
      schoolId: schoolId
    },
    include: { staffMember: true, teacher: true }
  });

  if (!userToUpdate) {
    throw new ApiError("الموظف غير موجود أو لا تملك صلاحية الوصول إليه", 404);
  }

  if (["SUPER_ADMIN", "PRINCIPAL"].includes(userToUpdate.role) && req.user.role !== "PRINCIPAL") {
    throw new ApiError("لا تملك صلاحية لتعديل بيانات هذا الحساب", 403);
  }

  let {
    email, password, phone, isActive, isEmailVerified,
    firstNameAr, lastNameAr, firstNameEn, lastNameEn,
    qualification, specialization
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
      throw new ApiError("البريد الإلكتروني أو رقم الهاتف مستخدم لحساب آخر", 400);
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
        isActive: isActive !== undefined ? isActive : undefined,
        isEmailVerified: isEmailVerified !== undefined ? isEmailVerified : undefined
      }
    });

    let profile = null;
    if (userToUpdate.teacher) {
      profile = await tx.teacher.update({
        where: { userId: user.id },
        data: {
          firstNameAr: firstNameAr || undefined,
          lastNameAr: lastNameAr || undefined,
          firstNameEn: firstNameEn !== undefined ? firstNameEn : undefined,
          lastNameEn: lastNameEn !== undefined ? lastNameEn : undefined,
          qualification: qualification !== undefined ? qualification : undefined,
          specialization: specialization !== undefined ? specialization : undefined,
        }
      });
    } else if (userToUpdate.staffMember) {
      profile = await tx.staffMember.update({
        where: { userId: user.id },
        data: {
          firstNameAr: firstNameAr || undefined,
          lastNameAr: lastNameAr || undefined,
          firstNameEn: firstNameEn !== undefined ? firstNameEn : undefined,
          lastNameEn: lastNameEn !== undefined ? lastNameEn : undefined,
        }
      });
    }

    return { user, profile };
  });

  const { passwordHash: _, ...safeUser } = result.user;

  res.status(200).json({
    status: "success",
    message: "تم تحديث بيانات الموظف بنجاح",
    data: {
      user: safeUser,
      profile: result.profile
    },
  });
});

/// ============================================================
// DELETE /api/management/staff/:id
// ============================================================
const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const schoolId = req.user.schoolId;

  const userToDelete = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
      schoolId: schoolId
    }
  });

  if (!userToDelete) {
    throw new ApiError("الموظف غير موجود أو لا تملك صلاحية حذفه", 404);
  }

  if (userToDelete.id === req.user.id) {
    throw new ApiError("لا يمكنك حذف حسابك الخاص!", 400);
  }

  if (userToDelete.role === "PRINCIPAL") {
    throw new ApiError("لا يمكنك حذف مدير المدرسة من هذه الواجهة", 403);
  }

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    status: "success",
    message: "تم مسح الموظف بنجاح",
  });
});

module.exports = {
  getStaff,
  addAdministrator,
  addAccountant,
  addTeacher,
  updateStaff,
  deleteStaff,
};
