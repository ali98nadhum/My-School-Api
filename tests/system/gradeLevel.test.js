const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let superAdminToken;
let principalToken;
let gradeLevelId;

beforeAll(async () => {
  // إنشاء مدرسة
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة اختبار المراحل",
      nameEn: "Test GradeLevels School",
    },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // إنشاء مدير نظام (Super Admin)
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin_grades@test.com",
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      isEmailVerified: true,
    },
  });

  // إنشاء مدير مدرسة (Principal)
  const principal = await prisma.user.create({
    data: {
      email: "principal_grades@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: school.id,
      isActive: true,
      isEmailVerified: true,
    },
  });

  superAdminToken = global.generateTestToken(superAdmin);
  principalToken = global.generateTestToken(principal);

  // تنظيف المراحل الدراسية
  await prisma.gradeLevel.deleteMany();
});

afterAll(async () => {
  await prisma.gradeLevel.deleteMany();
});

describe("Grade Level System API", () => {
  it("should prevent Principal from creating a grade level", async () => {
    const response = await request(app)
      .post("/api/system/grade-levels")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        nameEn: "First Grade",
        nameAr: "الأول الابتدائي",
        sortOrder: 1,
      });

    expect(response.status).toBe(403);
  });

  it("should allow Super Admin to create a grade level", async () => {
    const response = await request(app)
      .post("/api/system/grade-levels")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        nameEn: "First Grade",
        nameAr: "الأول الابتدائي",
        sortOrder: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.nameEn).toBe("First Grade");
    
    gradeLevelId = response.body.data.id;
  });

  it("should fail to create grade level with duplicate sortOrder", async () => {
    const response = await request(app)
      .post("/api/system/grade-levels")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        nameEn: "Second Grade",
        nameAr: "الثاني الابتدائي",
        sortOrder: 1, // Duplicate
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("يوجد مرحلة دراسية أخرى تستخدم نفس هذا الترتيب");
  });

  it("should allow Principal to get all grade levels", async () => {
    const response = await request(app)
      .get("/api/system/grade-levels")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].nameEn).toBe("First Grade");
  });

  it("should allow Super Admin to update a grade level", async () => {
    const response = await request(app)
      .put(`/api/system/grade-levels/${gradeLevelId}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        nameEn: "First Grade Updated",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.nameEn).toBe("First Grade Updated");
  });

  it("should prevent Principal from updating a grade level", async () => {
    const response = await request(app)
      .put(`/api/system/grade-levels/${gradeLevelId}`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        nameEn: "Hacked Grade",
      });

    expect(response.status).toBe(403);
  });

  it("should delete a grade level by Super Admin", async () => {
    const response = await request(app)
      .delete(`/api/system/grade-levels/${gradeLevelId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
