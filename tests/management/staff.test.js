const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let adminToken;
let schoolId;

beforeAll(async () => {
  const school = await prisma.school.create({
    data: {
      nameAr: "مدرسة الاختبار",
      nameEn: "Test School",
    },
  });
  schoolId = school.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal@test.com",
      passwordHash: hashedPassword,
      role: "PRINCIPAL",
      schoolId: schoolId,
      isActive: true,
      staffMember: {
        create: {
          employeeCode: "PRN-123",
          firstNameAr: "المدير",
          lastNameAr: "التجريبي",
          position: "مدير",
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      passwordHash: hashedPassword,
      role: "ADMINISTRATOR",
      schoolId: schoolId,
      isActive: true,
      staffMember: {
        create: {
          employeeCode: "ADM-123",
          firstNameAr: "الإداري",
          lastNameAr: "التجريبي",
          position: "إداري",
        },
      },
    },
  });

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);
});

describe("Staff Management API", () => {

  describe("POST /api/management/staff/teacher", () => {
    it("يجب أن يسمح لمدير المدرسة بإضافة معلم جديد", async () => {
      const res = await request(app)
        .post("/api/management/staff/teacher")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          email: "teacher1@test.com",
          password: "password123",
          firstNameAr: "أحمد",
          lastNameAr: "المعلم",
          phone: "07712345678",
          specialization: "رياضيات"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe("teacher1@test.com");
      expect(res.body.data.profile.specialization).toBe("رياضيات");
    });

    it("يجب أن يرفض إضافة معلم بدون إرسال بريد إلكتروني", async () => {
      const res = await request(app)
        .post("/api/management/staff/teacher")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          password: "password123",
          firstNameAr: "أحمد",
          lastNameAr: "المعلم"
        });

      expect(res.statusCode).toBe(400); // Validation error
    });
  });

  describe("POST /api/management/staff/admin", () => {
    it("يجب أن يرفض السماح للإداري بإضافة إداري آخر (مسموح للمدير فقط)", async () => {
      const res = await request(app)
        .post("/api/management/staff/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newadmin@test.com",
          password: "password123",
          firstNameAr: "إداري",
          lastNameAr: "جديد",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toContain("غير مصرح");
    });

    it("يجب أن يسمح لمدير المدرسة بإضافة إداري جديد", async () => {
      const res = await request(app)
        .post("/api/management/staff/admin")
        .set("Authorization", `Bearer ${principalToken}`)
        .send({
          email: "newadmin2@test.com",
          password: "password123",
          firstNameAr: "إداري",
          lastNameAr: "جديد",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.user.role).toBe("ADMINISTRATOR");
    });
  });

  describe("GET /api/management/staff", () => {
    it("يجب أن يسترجع قائمة الموظفين مدمجة بنجاح", async () => {
      const res = await request(app)
        .get("/api/management/staff")
        .set("Authorization", `Bearer ${principalToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBeGreaterThan(0);
      expect(res.body.data.staff[0]).toHaveProperty("profile");
    });
  });

});
