const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let adminToken;
let schoolId;
let academicYearId;
let gradeLevelId;
let classId;
let sectionId;
let teacherId;

beforeAll(async () => {
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة اختبار الشعب",
      nameEn: "Test Sections School",
    },
  });
  schoolId = school.id;

  const academicYear = await prisma.academicYear.create({
    data: {
      schoolId: schoolId,
      name: "2025/2026",
      isCurrent: true,
    }
  });
  academicYearId = academicYear.id;

  const gradeLevel = await prisma.gradeLevel.create({
    data: {
      nameEn: "Grade 1",
      nameAr: "الصف الأول",
      sortOrder: 1,
    }
  });
  gradeLevelId = gradeLevel.id;

  const schoolClass = await prisma.schoolClass.create({
    data: {
      gradeLevelId: gradeLevelId,
      academicYearId: academicYearId,
      nameEn: "Grade 1",
      nameAr: "الصف الأول",
    }
  });
  classId = schoolClass.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal_sections@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin_sections@test.com",
      passwordHash: hashedPassword,
      role: "ADMINISTRATOR",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      email: "teacher_sections@test.com",
      passwordHash: hashedPassword,
      role: "TEACHER",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      employeeCode: "EMP-SEC-001",
      firstNameAr: "معلم",
      lastNameAr: "اختبار",
    }
  });
  teacherId = teacher.id;

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);

  await prisma.section.deleteMany({
    where: { classId }
  });
});

afterAll(async () => {
  await prisma.section.deleteMany({ where: { classId } });
  await prisma.teacher.deleteMany({ where: { id: teacherId } });
  await prisma.schoolClass.deleteMany({ where: { id: classId } });
  await prisma.academicYear.deleteMany({ where: { id: academicYearId } });
  await prisma.gradeLevel.deleteMany({ where: { id: gradeLevelId } });
});

describe("Section Management API", () => {
  it("should allow Administrator to create a section", async () => {
    const response = await request(app)
      .post("/api/management/sections")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        classId: classId,
        name: "A",
        capacity: 35,
        homeroomTeacherId: teacherId,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.name).toBe("A");
    expect(response.body.data.capacity).toBe(35);

    sectionId = response.body.data.id;
  });

  it("should fail to create a duplicate section in the same class", async () => {
    const response = await request(app)
      .post("/api/management/sections")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        classId: classId,
        name: "A",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("يوجد شعبة بنفس الاسم");
  });

  it("should get all sections", async () => {
    const response = await request(app)
      .get("/api/management/sections")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].id).toBe(sectionId);
    expect(response.body.data[0].homeroomTeacher.firstNameAr).toBe("معلم");
  });

  it("should allow Administrator to update a section", async () => {
    const response = await request(app)
      .put(`/api/management/sections/${sectionId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "B",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("B");
  });

  it("should prevent Administrator from deleting a section", async () => {
    const response = await request(app)
      .delete(`/api/management/sections/${sectionId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(403);
  });

  it("should allow Principal to delete a section", async () => {
    const response = await request(app)
      .delete(`/api/management/sections/${sectionId}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
