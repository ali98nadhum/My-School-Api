const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");
const bcrypt = require("bcryptjs");

describe("Management Exam Routes", () => {
  let principalToken;
  let teacherToken;
  let schoolId;
  let principalId;
  let academicYearId;
  let classId;
  let subjectId;
  let sectionId;
  let examTypeId;

  beforeEach(async () => {
    // 1. Setup School
    const school = await prisma.school.create({
      data: { nameAr: "Test School" }
    });
    schoolId = school.id;

    // 2. Setup Principal
    const hashedPassword = await bcrypt.hash("123456", 10);
    const principalUser = await prisma.user.create({
      data: {
        email: "principal_exam@test.com",
        passwordHash: hashedPassword,
        role: "PRINCIPAL",
        schoolId
      }
    });
    principalId = principalUser.id;
    principalToken = generateToken(principalId, "PRINCIPAL");

    // 3. Setup Teacher (for negative test cases)
    const teacherUser = await prisma.user.create({
      data: {
        email: "teacher_exam@test.com",
        passwordHash: hashedPassword,
        role: "TEACHER",
        schoolId
      }
    });
    teacherToken = generateToken(teacherUser.id, "TEACHER");

    // 4. Setup Academic Year, Class, Section, Subject
    const academicYear = await prisma.academicYear.create({
      data: { name: "2024-2025", schoolId, isCurrent: true }
    });
    academicYearId = academicYear.id;

    const gradeLevel = await prisma.gradeLevel.create({
      data: { nameAr: "G1", nameEn: "G1", sortOrder: 1 }
    });

    const schoolClass = await prisma.schoolClass.create({
      data: { nameAr: "Class 1", nameEn: "Class 1", academicYearId, gradeLevelId: gradeLevel.id }
    });
    classId = schoolClass.id;

    const section = await prisma.section.create({
      data: { name: "A", classId }
    });
    sectionId = section.id;

    const subject = await prisma.subject.create({
      data: { nameAr: "Math", code: "MATH" }
    });
    subjectId = subject.id;

    // 5. Setup basic exam type
    const eType = await prisma.examType.create({
      data: { nameAr: "امتحان شهري", weightPercentage: 10 }
    });
    examTypeId = eType.id;
  });

  afterEach(async () => {
    await prisma.exam.deleteMany();
    await prisma.examType.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.section.deleteMany();
    await prisma.schoolClass.deleteMany();
    await prisma.gradeLevel.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
  });

  describe("Exam Types", () => {
    it("should create a new exam type (Principal)", async () => {
      const res = await request(app)
        .post("/api/management/exams/types")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          nameAr: "امتحان نصف السنة",
          weightPercentage: 30
        });

      expect(res.status).toBe(201);
      expect(res.body.data.nameAr).toBe("امتحان نصف السنة");
      expect(res.body.data.weightPercentage).toBe("30"); // Decimal comes back as string sometimes
    });

    it("should fail to create exam type with negative weight", async () => {
      const res = await request(app)
        .post("/api/management/exams/types")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          nameAr: "خطأ",
          weightPercentage: -10
        });

      expect(res.status).toBe(400); // Validation error
    });
  });

  describe("Exams", () => {
    it("should create an exam successfully", async () => {
      const res = await request(app)
        .post("/api/management/exams")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          academicYearId,
          examTypeId,
          subjectId,
          sectionId,
          examDate: "2025-05-15",
          maxScore: 100,
          passingScore: 50
        });

      expect(res.status).toBe(201);
      expect(res.body.data.academicYearId).toBe(academicYearId);
    });

    it("should prevent duplicate exam creation for same section, subject, type, year", async () => {
      await prisma.exam.create({
        data: {
          academicYearId,
          examTypeId,
          subjectId,
          sectionId,
          createdBy: principalId
        }
      });

      const res = await request(app)
        .post("/api/management/exams")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          academicYearId,
          examTypeId,
          subjectId,
          sectionId
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("مسبقاً");
    });

    it("should forbid Teacher from using Management Exam routes", async () => {
      const res = await request(app)
        .post("/api/management/exams")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          academicYearId,
          examTypeId,
          subjectId,
          sectionId
        });

      expect(res.status).toBe(403);
    });
  });
});
