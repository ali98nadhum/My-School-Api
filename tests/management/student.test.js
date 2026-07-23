const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

let principalToken;
let schoolId;
let parent1Id, parent2Id, parent3Id, parent4Id, parent5Id;
let student1Id;

beforeAll(async () => {
  const school = await prisma.school.create({
    data: { nameAr: "مدرسة الطلاب", nameEn: "Students School" },
  });
  schoolId = school.id;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const principal = await prisma.user.create({
    data: {
      email: "principal_stu@test.com", passwordHash: hashedPassword,
      role: "PRINCIPAL", schoolId, isActive: true, isEmailVerified: true,
    },
  });

  principalToken = global.generateTestToken(principal);

  await prisma.user.deleteMany({ where: { email: { startsWith: "prnt_stu_" } } });
  await prisma.student.deleteMany({ where: { studentCode: { startsWith: "STU-TEST" } } });

  const parentPromises = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: { email: `prnt_stu_${i}@test.com`, passwordHash: hashedPassword, role: "PARENT", schoolId }
    });
    const parent = await prisma.parent.create({
      data: { userId: user.id, firstNameAr: `أب ${i}`, lastNameAr: "تجربة", phonePrimary: `0700000000${i}` }
    });
    parentPromises.push(parent.id);
  }
  [parent1Id, parent2Id, parent3Id, parent4Id, parent5Id] = parentPromises;
});

afterAll(async () => {
  await prisma.studentGuardian.deleteMany({});
  await prisma.student.deleteMany({ where: { studentCode: { startsWith: "STU-TEST" } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: "prnt_stu_" } } });
});

describe("Student Management API", () => {
  it("should fail to create student without any parents", async () => {
    const res = await request(app)
      .post("/api/management/students")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentCode: "STU-TEST-1",
        firstNameAr: "طالب", lastNameAr: "أول",
        gender: "MALE",
        parentIds: []
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("يجب ربط الطالب بولي أمر واحد على الأقل");
  });

  it("should fail to create student with more than 4 parents", async () => {
    const res = await request(app)
      .post("/api/management/students")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentCode: "STU-TEST-1",
        firstNameAr: "طالب", lastNameAr: "أول",
        gender: "MALE",
        parentIds: [parent1Id, parent2Id, parent3Id, parent4Id, parent5Id] // 5 آباء
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("لا يمكن ربط الطالب بأكثر من 4");
  });

  it("should create student successfully with 2 parents", async () => {
    const res = await request(app)
      .post("/api/management/students")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentCode: "STU-TEST-1",
        firstNameAr: "طالب", lastNameAr: "أول",
        gender: "MALE",
        parentIds: [parent1Id, parent2Id]
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    student1Id = res.body.data.student.id;
  });

  it("should return 400 when duplicating studentCode", async () => {
    const res = await request(app)
      .post("/api/management/students")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentCode: "STU-TEST-1",
        firstNameAr: "طالب", lastNameAr: "ثاني",
        gender: "MALE",
        parentIds: [parent1Id]
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("مستخدم بالفعل");
  });

  it("should get students with pagination and filters", async () => {
    const res = await request(app)
      .get("/api/management/students?search=طالب&status=ACTIVE&gender=MALE&page=1&limit=5")
      .set("Authorization", `Bearer ${principalToken}`);
    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].studentGuardians.length).toBe(2);
  });

  it("should update student and change parentIds to 1 parent", async () => {
    const res = await request(app)
      .put(`/api/management/students/${student1Id}`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        firstNameAr: "طالب معدل",
        parentIds: [parent3Id]
      });
    expect(res.status).toBe(200);

    const check = await prisma.studentGuardian.findMany({ where: { studentId: student1Id } });
    expect(check.length).toBe(1);
    expect(check[0].parentId).toBe(parent3Id);
  });

  it("should delete student successfully", async () => {
    const res = await request(app)
      .delete(`/api/management/students/${student1Id}`)
      .set("Authorization", `Bearer ${principalToken}`);
    expect(res.status).toBe(200);
  });
});
