const { prisma } = require("../../config/prismaClient");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");
const compressImage = require("../../utils/imageCompressor");

/**
 * @desc    Get all students with pagination and filters
 * @route   GET /api/management/students
 * @access  Private (Principal, Administrator)
 */
exports.getStudents = asyncHandler(async (req, res, next) => {
  const { search, status, sectionId, gender, page = 1, limit = 10 } = req.query;


  const schoolId = req.user.schoolId;

  const where = {
    schoolId
  };

  if (status) where.status = status;
  if (gender) where.gender = gender;
  if (sectionId) where.currentSectionId = parseInt(sectionId, 10);

  if (search) {
    where.AND = [
      {
        OR: [
          { firstNameAr: { contains: search, mode: "insensitive" } },
          { lastNameAr: { contains: search, mode: "insensitive" } },
          { studentCode: { contains: search, mode: "insensitive" } },
          { nationalId: { contains: search, mode: "insensitive" } }
        ]
      }
    ];
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        currentSection: { select: { id: true, name: true, schoolClass: { select: { nameAr: true, nameEn: true } } } },
        studentGuardians: {
          include: { parent: { select: { id: true, firstNameAr: true, lastNameAr: true, phonePrimary: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.student.count({ where })
  ]);

  res.status(200).json({
    status: "success",
    results: students.length,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    },
    data: students,
  });
});

/**
 * @desc    Get specific student by ID
 * @route   GET /api/management/students/:id
 * @access  Private (Principal, Administrator)
 */
exports.getStudentById = asyncHandler(async (req, res, next) => {
  const studentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId
    },
    include: {
      user: { select: { email: true, isActive: true } },
      currentSection: { include: { schoolClass: true } },
      studentGuardians: { include: { parent: true } }
    }
  });

  if (!student) {
    throw new ApiError("الطالب غير موجود أو لا ينتمي لهذه المدرسة.", 404);
  }

  res.status(200).json({
    status: "success",
    data: student,
  });
});

/**
 * @desc    Create a new student
 * @route   POST /api/management/students
 * @access  Private (Principal, Administrator)
 */
exports.createStudent = asyncHandler(async (req, res, next) => {
  const {
    email, password, studentCode, firstNameAr, middleNameAr, lastNameAr,
    firstNameEn, middleNameEn, lastNameEn, gender, dateOfBirth, nationalId,
    nationality, enrollmentDate, currentSectionId, status, bloodType, address,
    parentIds
  } = req.body;
  const schoolId = req.user.schoolId;

  const parents = await prisma.parent.findMany({
    where: {
      id: { in: parentIds },
      user: { schoolId }
    }
  });

  if (parents.length !== parentIds.length) {
    throw new ApiError("بعض أو جميع أولياء الأمور المحددين غير موجودين أو لا ينتمون لهذه المدرسة.", 400);
  }

  if (email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new ApiError("البريد الإلكتروني مستخدم لحساب آخر.", 400);
  }

  if (nationalId) {
    const nationalExists = await prisma.student.findUnique({ where: { nationalId } });
    if (nationalExists) throw new ApiError("الرقم الوطني مستخدم لطالب آخر.", 400);
  }

  const generatedStudentCode = studentCode || `STU-${Date.now()}`;
  const codeExists = await prisma.student.findUnique({ where: { studentCode: generatedStudentCode } });
  if (codeExists) {
    throw new ApiError("الكود المدرسي مستخدم بالفعل لطالب آخر.", 400);
  }

  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  let avatarUrl = null;
  if (req.file) {
    const compressedName = await compressImage(req.file.path, req.file.filename, {
      outputDir: "uploads/images/avatars",
      width: 400,
      quality: 80
    });
    avatarUrl = `uploads/images/avatars/${compressedName}`;
  }

  const result = await prisma.$transaction(async (tx) => {
    let createdUserId = null;
    let safeUser = null;

    if (email && password) {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: "STUDENT",
          schoolId,
          isActive: true
        }
      });
      createdUserId = newUser.id;
      const { passwordHash: _, ...rest } = newUser;
      safeUser = rest;
    }

    const studentData = {
      userId: createdUserId,
      studentCode: generatedStudentCode,
      firstNameAr,
      middleNameAr: middleNameAr || null,
      lastNameAr,
      firstNameEn: firstNameEn || null,
      middleNameEn: middleNameEn || null,
      lastNameEn: lastNameEn || null,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      nationalId: nationalId || null,
      nationality: nationality || null,
      enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
      currentSectionId: currentSectionId ? parseInt(currentSectionId) : null,
      status: status || "ACTIVE",
      bloodType: bloodType || null,
      address: address || null,
      avatarUrl,
      schoolId: schoolId,
    };

    const newStudent = await tx.student.create({ data: studentData });

    const guardiansData = parentIds.map(parentId => ({
      studentId: newStudent.id,
      parentId: parentId,
      isPrimaryContact: true
    }));

    await tx.studentGuardian.createMany({ data: guardiansData });

    return { student: newStudent, user: safeUser, parentIds };
  });

  res.status(201).json({
    status: "success",
    message: "تم إنشاء ملف الطالب بنجاح وربطه بأولياء الأمور.",
    data: result
  });
});

/**
 * @desc    Update a student
 * @route   PUT /api/management/students/:id
 * @access  Private (Principal, Administrator)
 */
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const studentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;
  const {
    email, password, studentCode, firstNameAr, middleNameAr, lastNameAr,
    firstNameEn, middleNameEn, lastNameEn, gender, dateOfBirth, nationalId,
    nationality, enrollmentDate, currentSectionId, status, bloodType, address,
    parentIds
  } = req.body;

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId
    },
    include: { user: true }
  });

  if (!student) {
    throw new ApiError("الطالب غير موجود.", 404);
  }

  if (email && student.user && email !== student.user.email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new ApiError("البريد الإلكتروني مستخدم لحساب آخر.", 400);
  }

  if (nationalId && nationalId !== student.nationalId) {
    const nationalExists = await prisma.student.findUnique({ where: { nationalId } });
    if (nationalExists) throw new ApiError("الرقم الوطني مستخدم لطالب آخر.", 400);
  }

  if (studentCode && studentCode !== student.studentCode) {
    const codeExists = await prisma.student.findUnique({ where: { studentCode } });
    if (codeExists) throw new ApiError("الكود المدرسي مستخدم بالفعل لطالب آخر.", 400);
  }

  if (parentIds) {
    const parents = await prisma.parent.findMany({
      where: { id: { in: parentIds }, user: { schoolId } }
    });
    if (parents.length !== parentIds.length) {
      throw new ApiError("بعض أو جميع أولياء الأمور المحددين غير موجودين في المدرسة.", 400);
    }
  }

  let avatarUrl = student.avatarUrl;
  if (req.file) {
    const compressedName = await compressImage(req.file.path, req.file.filename, {
      outputDir: "uploads/images/avatars",
      width: 400,
      quality: 80
    });
    avatarUrl = `uploads/images/avatars/${compressedName}`;
  }

  await prisma.$transaction(async (tx) => {
    if (student.userId && (email || password)) {
      const dataToUpdate = {};
      if (email) dataToUpdate.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        dataToUpdate.passwordHash = await bcrypt.hash(password, salt);
      }
      await tx.user.update({
        where: { id: student.userId },
        data: dataToUpdate
      });
    }

    if (parentIds) {
      await tx.studentGuardian.deleteMany({ where: { studentId } });
      const newGuardians = parentIds.map(pId => ({
        studentId,
        parentId: pId,
        isPrimaryContact: true
      }));
      await tx.studentGuardian.createMany({ data: newGuardians });
    }

    const studentData = {
      studentCode: studentCode !== undefined ? studentCode : student.studentCode,
      firstNameAr: firstNameAr || student.firstNameAr,
      middleNameAr: middleNameAr !== undefined ? middleNameAr : student.middleNameAr,
      lastNameAr: lastNameAr || student.lastNameAr,
      firstNameEn: firstNameEn !== undefined ? firstNameEn : student.firstNameEn,
      middleNameEn: middleNameEn !== undefined ? middleNameEn : student.middleNameEn,
      lastNameEn: lastNameEn !== undefined ? lastNameEn : student.lastNameEn,
      gender: gender || student.gender,
      dateOfBirth: dateOfBirth !== undefined ? (dateOfBirth ? new Date(dateOfBirth) : null) : student.dateOfBirth,
      nationalId: nationalId !== undefined ? nationalId : student.nationalId,
      nationality: nationality !== undefined ? nationality : student.nationality,
      enrollmentDate: enrollmentDate !== undefined ? (enrollmentDate ? new Date(enrollmentDate) : null) : student.enrollmentDate,
      currentSectionId: currentSectionId !== undefined ? (currentSectionId ? parseInt(currentSectionId) : null) : student.currentSectionId,
      status: status || student.status,
      bloodType: bloodType !== undefined ? bloodType : student.bloodType,
      address: address !== undefined ? address : student.address,
      avatarUrl: avatarUrl
    };

    await tx.student.update({
      where: { id: studentId },
      data: studentData
    });
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث بيانات الطالب بنجاح."
  });
});

/**
 * @desc    Delete a student
 * @route   DELETE /api/management/students/:id
 * @access  Private (Principal)
 */
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const studentId = parseInt(req.params.id, 10);
  const schoolId = req.user.schoolId;

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId
    },
    include: { attendanceRecords: true, examResults: true, invoices: true }
  });

  if (!student) {
    throw new ApiError("الطالب غير موجود.", 404);
  }

  if (student.invoices.length > 0) {
    throw new ApiError("لا يمكن حذف الطالب بسبب وجود سجلات مالية وفواتير مرتبطة به.", 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.student.delete({ where: { id: studentId } });
    if (student.userId) {
      await tx.user.delete({ where: { id: student.userId } });
    }
  });

  res.status(200).json({
    status: "success",
    message: "تم حذف الطالب بنجاح."
  });
});
