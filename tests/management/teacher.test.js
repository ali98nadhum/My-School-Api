const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let adminToken;
let schoolId;
let teacherId;
let subjectId;
let classId;
let sectionId;
let academicYearId;
let gradeLevelId;

beforeAll(async () => {
  // 1. إنشاء مدرسة
  const school = await prisma.school.create({
    data: { nameAr: "مدرسة المعلمين", nameEn: "Teachers School" },
  });
  schoolId = school.id;

  // 2. إنشاء سنة دراسية
  const academicYear = await prisma.academicYear.create({
    data: { schoolId, name: "2025/2026", isCurrent: true }
  });
  academicYearId = academicYear.id;

  // 3. إنشاء مرحلة وصف وشعبة
  const gradeLevel = await prisma.gradeLevel.create({
    data: { nameEn: "Grade 1", nameAr: "الأول", sortOrder: 10 }
  });
  gradeLevelId = gradeLevel.id;

  const schoolClass = await prisma.schoolClass.create({
    data: { gradeLevelId, academicYearId, nameEn: "Grade 1", nameAr: "الأول" }
  });
  classId = schoolClass.id;

  const section = await prisma.section.create({
    data: { classId, name: "A", capacity: 30 }
  });
  sectionId = section.id;

  // 4. إنشاء مادة
  const subject = await prisma.subject.create({
    data: { code: "TCH_SUB", nameEn: "TCH Subject", nameAr: "مادة للمعلم" }
  });
  subjectId = subject.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // 5. إنشاء مدير وإداري
  const principal = await prisma.user.create({
    data: {
      email: "principal_teachers@test.com", passwordHash: hashedPassword,
      role: "PRINCIPAL", schoolId, isActive: true, isEmailVerified: true,
    },
  });
  const admin = await prisma.user.create({
    data: {
      email: "admin_teachers@test.com", passwordHash: hashedPassword,
      role: "ADMINISTRATOR", schoolId, isActive: true, isEmailVerified: true,
    },
  });

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);

  // تنظيف أي بيانات لمعلمين اختبار
  await prisma.user.deleteMany({ where: { email: { startsWith: "tch_" } } });
});

afterAll(async () => {
  await prisma.sectionSubjectTeacher.deleteMany({ where: { sectionId } });
  await prisma.section.deleteMany({ where: { id: sectionId } });
  await prisma.schoolClass.deleteMany({ where: { id: classId } });
  await prisma.academicYear.deleteMany({ where: { id: academicYearId } });
  await prisma.subject.delete({ where: { id: subjectId } });
  await prisma.gradeLevel.delete({ where: { id: gradeLevelId } });
  await prisma.user.deleteMany({ where: { email: { startsWith: "tch_" } } });
});

describe("Teacher Management API", () => {
  it("should allow Administrator to create a teacher", async () => {
    const response = await request(app)
      .post("/api/management/teachers")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "tch_1@test.com",
        password: "password123",
        phone: "07700000001",
        firstNameAr: "أحمد",
        lastNameAr: "محمد",
        specialization: "الرياضيات"
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe("tch_1@test.com");
    expect(response.body.data.profile.firstNameAr).toBe("أحمد");
    
    teacherId = response.body.data.profile.id;
  });

  it("should return 400 (NOT 500) when creating teacher with duplicate email", async () => {
    const response = await request(app)
      .post("/api/management/teachers")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        email: "tch_1@test.com",
        password: "password123",
        firstNameAr: "أحمد",
        lastNameAr: "محمد",
      });

    expect(response.status).toBe(400); // 400 بدل 500
    expect(response.body.message).toContain("مسجل مسبقاً");
  });

  it("should get all teachers with pagination and filters", async () => {
    const response = await request(app)
      .get("/api/management/teachers?search=أحمد&page=1&limit=5")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].firstNameAr).toBe("أحمد");
  });

  it("should assign teacher to a section and subject", async () => {
    const response = await request(app)
      .post(`/api/management/teachers/${teacherId}/assignments`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        sectionId: sectionId,
        subjectId: subjectId,
        academicYearId: academicYearId
      });

    expect(response.status).toBe(201);
    expect(response.body.data.sectionId).toBe(sectionId);
  });

  it("should prevent Administrator from deleting a teacher", async () => {
    const response = await request(app)
      .delete(`/api/management/teachers/${teacherId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(403);
  });

  it("should return 400 when Principal deletes a teacher with assignments (prevent 500)", async () => {
    const response = await request(app)
      .delete(`/api/management/teachers/${teacherId}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("لا يمكن حذف هذا المعلم لوجود جداول أو مواد أو شعب مرتبطة به");
  });

  it("should allow Principal to delete a teacher after removing assignments", async () => {
    // 1. إزالة الارتباط
    await prisma.sectionSubjectTeacher.deleteMany({
      where: { teacherId }
    });

    // 2. الحذف
    const response = await request(app)
      .delete(`/api/management/teachers/${teacherId}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
