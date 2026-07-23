const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");

describe("Student Enrollment Management API", () => {
  let principalToken;
  let testSchoolId;
  let academicYearId;
  let gradeLevelId;
  let schoolClassId;
  let section1Id;
  let section2Id;
  let student1Id;
  let student2Id;
  let enrollment1Id;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: { startsWith: "test_principal_enrollment" } } });
    await prisma.student.deleteMany({ where: { studentCode: { startsWith: "ENR-STU-" } } });
    await prisma.academicYear.deleteMany({ where: { name: "Enrollment Test Year" } });

    const hashedPassword = await bcrypt.hash("123456", 10);
    const principal = await prisma.user.create({
      data: {
        email: "test_principal_enrollment@test.com",
        passwordHash: hashedPassword,
        role: "PRINCIPAL",
        school: {
          create: { nameAr: "Enrollment Test School", nameEn: "Enrollment Test School", address: "Enrollment Address" }
        }
      },
      include: { school: true }
    });

    testSchoolId = principal.schoolId;
    principalToken = global.generateTestToken(principal);

    const academicYear = await prisma.academicYear.create({
      data: { name: "Enrollment Test Year", startDate: new Date(), endDate: new Date(), isCurrent: true, schoolId: testSchoolId }
    });
    academicYearId = academicYear.id;

    const gradeLevel = await prisma.gradeLevel.create({
      data: { nameAr: "الصف الأول", nameEn: "First Grade", sortOrder: 1 }
    });
    gradeLevelId = gradeLevel.id;

    const schoolClass = await prisma.schoolClass.create({
      data: {
        nameAr: "الأول أ", nameEn: "1A",
        academicYearId, gradeLevelId
      }
    });
    schoolClassId = schoolClass.id;

    const section1 = await prisma.section.create({
      data: { name: "شعبة أ", capacity: 1, classId: schoolClassId }
    });
    section1Id = section1.id;

    const section2 = await prisma.section.create({
      data: { name: "شعبة ب", capacity: 10, classId: schoolClassId }
    });
    section2Id = section2.id;

    const s1 = await prisma.student.create({
      data: {
        studentCode: "ENR-STU-01", firstNameAr: "طالب 1", lastNameAr: "تجربة", gender: "MALE", schoolId: testSchoolId
      }
    });
    student1Id = s1.id;

    const s2 = await prisma.student.create({
      data: {
        studentCode: "ENR-STU-02", firstNameAr: "طالب 2", lastNameAr: "تجربة", gender: "MALE", schoolId: testSchoolId
      }
    });
    student2Id = s2.id;
  });

  afterAll(async () => {
    const studentIds = [student1Id, student2Id].filter(id => id !== undefined);
    if (studentIds.length > 0) {
      await prisma.studentEnrollment.deleteMany({ where: { studentId: { in: studentIds } } });
      await prisma.student.deleteMany({ where: { id: { in: studentIds } } });
    }
    const sectionIds = [section1Id, section2Id].filter(id => id !== undefined);
    if (sectionIds.length > 0) {
      await prisma.section.deleteMany({ where: { id: { in: sectionIds } } });
    }
    await prisma.schoolClass.deleteMany({ where: { academicYearId } });
    await prisma.gradeLevel.delete({ where: { id: gradeLevelId } });
    await prisma.academicYear.delete({ where: { id: academicYearId } });
    await prisma.user.delete({ where: { email: "test_principal_enrollment@test.com" } });
    await prisma.school.delete({ where: { id: testSchoolId } });
  });

  it("should enroll student1 in class but no section initially", async () => {
    const res = await request(app)
      .post("/api/management/enrollments")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentId: student1Id,
        classId: schoolClassId
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");

    const student = await prisma.student.findUnique({ where: { id: student1Id } });
    expect(student.currentSectionId).toBeNull();
  });

  it("should assign student1 to section1", async () => {
    const listRes = await request(app)
      .get("/api/management/enrollments")
      .set("Authorization", `Bearer ${principalToken}`);
    enrollment1Id = listRes.body.data[0].id;

    const res = await request(app)
      .put(`/api/management/enrollments/${enrollment1Id}/assign-section`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({ sectionId: section1Id });
    expect(res.status).toBe(200);

    const student = await prisma.student.findUnique({ where: { id: student1Id } });
    expect(student.currentSectionId).toBe(section1Id);
  });

  it("should prevent double enrollment for the same student in the same year", async () => {
    const res = await request(app)
      .post("/api/management/enrollments")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentId: student1Id,
        classId: schoolClassId,
        sectionId: section2Id
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("مسجل بالفعل");
  });

  it("should fail to enroll student2 in section1 because capacity is 1", async () => {
    const res = await request(app)
      .post("/api/management/enrollments")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        studentId: student2Id,
        classId: schoolClassId,
        sectionId: section1Id
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("السعة القصوى");
  });

  it("should get enrollments list", async () => {
    const res = await request(app)
      .get("/api/management/enrollments")
      .set("Authorization", `Bearer ${principalToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    enrollment1Id = res.body.data[0].id;
  });

  it("should transfer student1 to section2", async () => {
    const res = await request(app)
      .put(`/api/management/enrollments/${enrollment1Id}/transfer`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({ newSectionId: section2Id });
    expect(res.status).toBe(200);

    const student = await prisma.student.findUnique({ where: { id: student1Id } });
    expect(student.currentSectionId).toBe(section2Id);
  });

  it("should remove student1 from section", async () => {
    const res = await request(app)
      .put(`/api/management/enrollments/${enrollment1Id}/remove-section`)
      .set("Authorization", `Bearer ${principalToken}`);
    expect(res.status).toBe(200);

    const student = await prisma.student.findUnique({ where: { id: student1Id } });
    expect(student.currentSectionId).toBeNull();
  });

  it("should update enrollment status", async () => {
    const res = await request(app)
      .put(`/api/management/enrollments/${enrollment1Id}/status`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({ status: "WITHDRAWN" });
    expect(res.status).toBe(200);

    const enrollment = await prisma.studentEnrollment.findUnique({ where: { id: enrollment1Id } });
    expect(enrollment.status).toBe("WITHDRAWN");
  });
});
