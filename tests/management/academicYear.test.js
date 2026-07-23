const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let token;
let schoolId;
let yearId;

beforeAll(async () => {
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة اختبار السنوات",
      nameEn: "Test School Years",
    },
  });
  schoolId = school.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal_years@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: schoolId,
      isActive: true,
      isEmailVerified: true,
    },
  });

  token = global.generateTestToken(principal);
});

afterAll(async () => {
  // Clean up
  await prisma.academicYear.deleteMany({
    where: { schoolId },
  });
});

describe("Academic Year Management API", () => {
  it("should create a new academic year", async () => {
    const response = await request(app)
      .post("/api/management/academic-years")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "2025/2026",
        startDate: "2025-09-01",
        endDate: "2026-06-30",
        isCurrent: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.name).toBe("2025/2026");
    expect(response.body.data.isCurrent).toBe(true);

    yearId = response.body.data.id;
  });

  it("should fail to create academic year with duplicate name", async () => {
    const response = await request(app)
      .post("/api/management/academic-years")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "2025/2026",
        startDate: "2025-09-01",
        endDate: "2026-06-30",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("يوجد سنة دراسية بهذا الاسم");
  });

  it("should get all academic years", async () => {
    const response = await request(app)
      .get("/api/management/academic-years")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].name).toBe("2025/2026");
  });

  it("should update an academic year", async () => {
    const response = await request(app)
      .put(`/api/management/academic-years/${yearId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "2025-2026",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("2025-2026");
  });

  it("should create a second year and set it as current, turning off the first one", async () => {
    // Create new
    const response1 = await request(app)
      .post("/api/management/academic-years")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "2026-2027",
        isCurrent: true,
      });
    expect(response1.status).toBe(201);
    const secondYearId = response1.body.data.id;

    // Check first year
    const firstYear = await prisma.academicYear.findUnique({ where: { id: yearId } });
    expect(firstYear.isCurrent).toBe(false);

    // Patch to set first year as current again
    const response2 = await request(app)
      .patch(`/api/management/academic-years/${yearId}/set-current`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response2.status).toBe(200);
    expect(response2.body.data.isCurrent).toBe(true);

    // Check second year
    const secondYear = await prisma.academicYear.findUnique({ where: { id: secondYearId } });
    expect(secondYear.isCurrent).toBe(false);
  });

  it("should delete an academic year", async () => {
    const response = await request(app)
      .delete(`/api/management/academic-years/${yearId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("نجاح");
  });
});
