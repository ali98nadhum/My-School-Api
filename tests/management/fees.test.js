const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");
const bcrypt = require("bcryptjs");

describe("Management Fee Routes", () => {
  let principalToken;
  let teacherToken;
  let schoolId;
  let academicYearId;
  let gradeLevelId;
  let feeTypeId;
  let feeStructureId;

  beforeEach(async () => {
    // 1. Setup School
    const school = await prisma.school.create({
      data: { nameAr: "Test School" }
    });
    schoolId = school.id;

    // 2. Setup Principal
    const hashedPassword = await bcrypt.hash("123456", 10);
    const principalEmail = `principal_fee_${Date.now()}@test.com`;
    const principalUser = await prisma.user.create({
      data: {
        email: principalEmail,
        passwordHash: hashedPassword,
        role: "PRINCIPAL",
        schoolId
      }
    });
    principalToken = generateToken(principalUser.id, "PRINCIPAL");

    // 3. Setup Teacher
    const teacherEmail = `teacher_fee_${Date.now()}@test.com`;
    const teacherUser = await prisma.user.create({
      data: {
        email: teacherEmail,
        passwordHash: hashedPassword,
        role: "TEACHER",
        schoolId
      }
    });
    teacherToken = generateToken(teacherUser.id, "TEACHER");

    // 4. Setup Academic Year & Grade Level
    const academicYear = await prisma.academicYear.create({
      data: { name: "2024-2025", schoolId, isCurrent: true }
    });
    academicYearId = academicYear.id;

    const gradeLevel = await prisma.gradeLevel.create({
      data: { nameAr: "G1", nameEn: "G1", sortOrder: Math.floor(Math.random() * 10000) }
    });
    gradeLevelId = gradeLevel.id;
  });

  afterEach(async () => {
    await prisma.feeStructure.deleteMany();
    await prisma.feeType.deleteMany();
    await prisma.gradeLevel.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
  });

  describe("Fee Types", () => {
    it("should create a new fee type (Principal)", async () => {
      const res = await request(app)
        .post("/api/management/fees/types")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          nameAr: "رسوم دراسية",
          nameEn: "Tuition Fee"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.nameAr).toBe("رسوم دراسية");
      feeTypeId = res.body.data.id;
    });

    it("should prevent Teacher from creating fee type", async () => {
      const res = await request(app)
        .post("/api/management/fees/types")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          nameAr: "رسوم باص"
        });

      expect(res.status).toBe(403);
    });

    it("should update a fee type", async () => {
      const fee = await prisma.feeType.create({ data: { nameAr: "رسوم تسجيل" } });

      const res = await request(app)
        .put(`/api/management/fees/types/${fee.id}`)
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          nameEn: "Registration Fee"
        });

      expect(res.status).toBe(200);
      expect(res.body.data.nameEn).toBe("Registration Fee");
    });
  });

  describe("Fee Structures", () => {
    beforeEach(async () => {
      const fee = await prisma.feeType.create({ data: { nameAr: "قسط دراسي" } });
      feeTypeId = fee.id;
    });

    it("should create a fee structure successfully", async () => {
      const res = await request(app)
        .post("/api/management/fees/structure")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          gradeLevelId,
          academicYearId,
          feeTypeId,
          amount: 5000
        });

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe("5000");
    });

    it("should return 400 if fee amount is negative", async () => {
      const res = await request(app)
        .post("/api/management/fees/structure")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          gradeLevelId,
          academicYearId,
          feeTypeId,
          amount: -500
        });

      expect(res.status).toBe(400); // Bad Request from Validator
      expect(res.body.message).toContain("يجب أن يكون رقماً موجباً");
    });

    it("should prevent duplicate fee structure", async () => {
      // Create first structure
      await prisma.feeStructure.create({
        data: { gradeLevelId, academicYearId, feeTypeId, amount: 2000 }
      });

      // Try to create again
      const res = await request(app)
        .post("/api/management/fees/structure")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          gradeLevelId,
          academicYearId,
          feeTypeId,
          amount: 3000
        });

      // Should return 400 Custom Error
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("تمت إضافته مسبقاً");
    });
  });
});
