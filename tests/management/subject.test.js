const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let adminToken;
let schoolId;
let subjectId;

beforeAll(async () => {
  // 1. إنشاء مدرسة
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة اختبار المواد",
      nameEn: "Test Subjects School",
    },
  });
  schoolId = school.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // 2. إنشاء مدير
  const principal = await prisma.user.create({
    data: {
      email: "principal_subjects@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  // 3. إنشاء إداري
  const admin = await prisma.user.create({
    data: {
      email: "admin_subjects@test.com",
      passwordHash: hashedPassword,
      role: "ADMINISTRATOR",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);

  // تنظيف أي مادة برمز الاختبار
  await prisma.subject.deleteMany({
    where: { code: { startsWith: "TEST_" } }
  });
});

afterAll(async () => {
  // تنظيف شامل
  await prisma.subject.deleteMany({
    where: { code: { startsWith: "TEST_" } }
  });
});

describe("Subject Management API", () => {
  it("should allow Administrator to create a subject", async () => {
    const response = await request(app)
      .post("/api/management/subjects")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: "TEST_MAT101",
        nameEn: "Mathematics",
        nameAr: "الرياضيات",
        isActive: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.code).toBe("TEST_MAT101");
    
    subjectId = response.body.data.id;
  });

  it("should return 400 (NOT 500) when creating a subject with duplicate code", async () => {
    const response = await request(app)
      .post("/api/management/subjects")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        code: "TEST_MAT101",
        nameEn: "Another Math",
        nameAr: "رياضيات أخرى",
      });

    expect(response.status).toBe(400); // وليس 500
    expect(response.body.message).toContain("يوجد مادة دراسية أخرى مسجلة بنفس الرمز");
  });

  it("should get all subjects", async () => {
    const response = await request(app)
      .get("/api/management/subjects")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
  });

  it("should allow Administrator to update a subject", async () => {
    const response = await request(app)
      .put(`/api/management/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nameAr: "الرياضيات المتقدمة",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.nameAr).toBe("الرياضيات المتقدمة");
  });

  it("should prevent Administrator from deleting a subject", async () => {
    const response = await request(app)
      .delete(`/api/management/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(403);
  });

  it("should allow Principal to delete a subject", async () => {
    const response = await request(app)
      .delete(`/api/management/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
