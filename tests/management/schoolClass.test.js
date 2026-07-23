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

beforeAll(async () => {
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة اختبار الصفوف",
      nameEn: "Test Classes School",
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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal_classes@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin_classes@test.com",
      passwordHash: hashedPassword,
      role: "ADMINISTRATOR",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);

  const years = await prisma.academicYear.findMany({ where: { schoolId } });
  const yearIds = years.map(y => y.id);
  await prisma.schoolClass.deleteMany({
    where: { academicYearId: { in: yearIds } }
  });
});

afterAll(async () => {
  await prisma.schoolClass.deleteMany({});
  await prisma.academicYear.deleteMany({});
  await prisma.gradeLevel.deleteMany({});
});

describe("School Class Management API", () => {
  it("should allow Administrator to create a school class", async () => {
    const response = await request(app)
      .post("/api/management/classes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        gradeLevelId: gradeLevelId,
        academicYearId: academicYearId,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.nameEn).toBe("Grade 1");
    classId = response.body.data.id;
  });

  it("should fail to create a duplicate class for the same grade in the same year", async () => {
    const response = await request(app)
      .post("/api/management/classes")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        gradeLevelId: gradeLevelId,
        academicYearId: academicYearId,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("يوجد صف لهذه المرحلة");
  });

  it("should get all school classes", async () => {
    const response = await request(app)
      .get("/api/management/classes")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].id).toBe(classId);
    expect(response.body.data[0].gradeLevel.nameEn).toBe("Grade 1");
  });

  it("should allow Administrator to update a school class name", async () => {
    const response = await request(app)
      .put(`/api/management/classes/${classId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nameAr: "الصف الأول المميز",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.nameAr).toBe("الصف الأول المميز");
  });

  it("should prevent Administrator from deleting a class", async () => {
    const response = await request(app)
      .delete(`/api/management/classes/${classId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(403);
  });

  it("should allow Principal to delete a class", async () => {
    const response = await request(app)
      .delete(`/api/management/classes/${classId}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
