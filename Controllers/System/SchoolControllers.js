const asyncHandler = require("express-async-handler");
const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

/// ============================================================
// POST /api/management/schools
// ============================================================
const createSchool = asyncHandler(async (req, res) => {
  let { nameAr, nameEn, address, phone } = req.body;

  nameAr = nameAr || null;
  nameEn = nameEn || null;
  address = address || null;
  phone = phone || null;

  const conditions = [];
  if (nameAr) conditions.push({ nameAr });
  if (nameEn) conditions.push({ nameEn });

  if (conditions.length > 0) {
    const existingSchool = await prisma.school.findFirst({
      where: { OR: conditions }
    });

    if (existingSchool) {
      throw new ApiError("يوجد مدرسة مسجلة مسبقاً بنفس الاسم العربي أو الإنجليزي", 400);
    }
  }

  const school = await prisma.school.create({
    data: {
      nameAr,
      nameEn,
      address,
      phone,
    },
  });

  res.status(201).json({
    status: "success",
    message: "تم إنشاء المدرسة بنجاح",
    data: { school },
  });
});

/// ============================================================
// GET /api/management/schools
// ============================================================
const getSchools = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const where = search
    ? {
      OR: [
        { nameAr: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
      ],
    }
    : {};

  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.school.count({ where }),
  ]);

  res.status(200).json({
    status: "success",
    message: "تم جلب المدارس بنجاح",
    data: {
      schools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

/// ============================================================
// GET /api/management/schools/:id
// ============================================================
const getSchoolById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const school = await prisma.school.findUnique({
    where: { id: parseInt(id) },
  });

  if (!school) {
    throw new ApiError("المدرسة غير موجودة", 404);
  }

  res.status(200).json({
    status: "success",
    message: "تم جلب المدرسة بنجاح",
    data: { school },
  });
});

/// ============================================================
// PUT /api/management/schools/:id
// ============================================================
const updateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nameAr, nameEn, address, phone } = req.body;

  const school = await prisma.school.findUnique({
    where: { id: parseInt(id) },
  });

  if (!school) {
    throw new ApiError("المدرسة غير موجودة", 404);
  }

  const updatedSchool = await prisma.school.update({
    where: { id: parseInt(id) },
    data: {
      nameAr: nameAr || school.nameAr,
      nameEn: nameEn || school.nameEn,
      address: address !== undefined ? address : school.address,
      phone: phone !== undefined ? phone : school.phone,
    },
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث بيانات المدرسة بنجاح",
    data: { school: updatedSchool },
  });
});

/// ============================================================
// DELETE /api/management/schools/:id
// ============================================================
const deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const school = await prisma.school.findUnique({
    where: { id: parseInt(id) },
  });

  if (!school) {
    throw new ApiError("المدرسة غير موجودة", 404);
  }

  await prisma.school.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف المدرسة بنجاح",
    data: null,
  });
});

module.exports = {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
};
