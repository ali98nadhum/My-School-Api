const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let adminToken;
let schoolId;
let parentId1;
let parentId2;
let studentId;

beforeAll(async () => {
  const school = await prisma.school.create({
    data: { nameAr: "مدرسة الآباء", nameEn: "Parents School" },
  });
  schoolId = school.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal_parents@test.com", passwordHash: hashedPassword,
      role: "PRINCIPAL", schoolId, isActive: true, isEmailVerified: true,
    },
  });
  const admin = await prisma.user.create({
    data: {
      email: "admin_parents@test.com", passwordHash: hashedPassword,
      role: "ADMINISTRATOR", schoolId, isActive: true, isEmailVerified: true,
    },
  });

  principalToken = global.generateTestToken(principal);
  adminToken = global.generateTestToken(admin);

  // تنظيف
  await prisma.user.deleteMany({ where: { email: { startsWith: "prnt_" } } });
  await prisma.student.deleteMany({ where: { studentCode: "STU-PARENT-TEST" } });

  // إنشاء طالب لاختبار الربط
  const student = await prisma.student.create({
    data: {
      studentCode: "STU-PARENT-TEST",
      firstNameAr: "طالب",
      lastNameAr: "تجربة",
    }
  });
  studentId = student.id;
});

afterAll(async () => {
  await prisma.studentGuardian.deleteMany({ where: { studentId } });
  await prisma.student.delete({ where: { id: studentId } });
  await prisma.user.deleteMany({ where: { email: { startsWith: "prnt_" } } });
});

describe("Parent Management API", () => {
  it("should allow Administrator to create a parent", async () => {
    const response = await request(app)
      .post("/api/management/parents")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "prnt_1@test.com",
        password: "password123",
        phonePrimary: "07700000101",
        firstNameAr: "أب",
        lastNameAr: "أول",
        nationalId: "123456789"
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    parentId1 = response.body.data.profile.id;
  });

  it("should return 400 when creating parent with duplicate email", async () => {
    const response = await request(app)
      .post("/api/management/parents")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        email: "prnt_1@test.com",
        password: "password123",
        phonePrimary: "07700000102",
        firstNameAr: "أب",
        lastNameAr: "مكرر",
      });

    expect(response.status).toBe(400); // وليس 500
    expect(response.body.message).toContain("مسجل مسبقاً");
  });

  it("should get parents with pagination and filter", async () => {
    const response = await request(app)
      .get("/api/management/parents?search=أب&page=1&limit=5")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it("should allow Administrator to create a parent without email", async () => {
    const response = await request(app)
      .post("/api/management/parents")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        password: "password123",
        phonePrimary: "07700000999",
        firstNameAr: "أب",
        lastNameAr: "بدون إيميل",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe("parent_07700000999@no-email.local");
  });

  it("should link a parent to a student", async () => {
    const response = await request(app)
      .post(`/api/management/parents/${parentId1}/students`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({ studentId });

    expect(response.status).toBe(201);
    expect(response.body.data.studentId).toBe(studentId);
    expect(response.body.data.parentId).toBe(parentId1);
  });

  it("should prevent deleting a parent if they are the ONLY guardian of a student", async () => {
    const response = await request(app)
      .delete(`/api/management/parents/${parentId1}`)
      .set("Authorization", `Bearer ${principalToken}`);

    expect(response.status).toBe(400); // وليس 500
    expect(response.body.message).toContain("الولي الوحيد للطالب");
  });

  it("should enforce max 4 parents per student", async () => {
    // إنشاء 4 آباء إضافيين وربط 3 منهم ليصبح المجموع 4
    for(let i=2; i<=5; i++) {
      const parentRes = await request(app).post("/api/management/parents").set("Authorization", `Bearer ${adminToken}`).send({
        email: `prnt_${i}@test.com`,
        password: "password123",
        phonePrimary: `0770000010${i}`,
        firstNameAr: `أب ${i}`,
        lastNameAr: "تجربة",
      });
      const pId = parentRes.body.data.profile.id;
      if (i === 2) parentId2 = pId; // نحفظ واحد للتيست القادم

      const linkRes = await request(app).post(`/api/management/parents/${pId}/students`).set("Authorization", `Bearer ${adminToken}`).send({ studentId });
      
      if (i === 5) {
        // المحاولة الخامسة (المجموع سيصبح 5 وهذا مرفوض)
        expect(linkRes.status).toBe(400);
        expect(linkRes.body.message).toContain("لا يمكن ربط الطالب بأكثر من 4");
      } else {
        expect(linkRes.status).toBe(201);
      }
    }
  });

  it("should prevent unlinking if it's the last parent", async () => {
    // سنقوم بفك ارتباط الجميع عدا واحد
    // نطلب الآباء المرتبطين بالطالب
    const guardians = await prisma.studentGuardian.findMany({ where: { studentId } });
    
    // فك ارتباط الكل عدا الأخير
    for(let i=0; i < guardians.length - 1; i++) {
      const res = await request(app).delete(`/api/management/parents/${guardians[i].parentId}/students/${studentId}`).set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    }

    // محاولة فك ارتباط الأخير
    const lastGuardian = guardians[guardians.length - 1];
    const resFail = await request(app).delete(`/api/management/parents/${lastGuardian.parentId}/students/${studentId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(resFail.status).toBe(400);
    expect(resFail.body.message).toContain("يجب أن يمتلك الطالب ولي أمر واحد على الأقل");
  });
});
