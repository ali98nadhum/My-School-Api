const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");

describe("Timetable Management API", () => {
  let principalToken;
  let testSchoolId;
  let academicYearId;
  let schoolClassId;
  let section1Id;
  let section2Id;
  let teacher1Id;
  let teacher2Id;
  let subject1Id;
  let subject2Id;
  let period1Id;
  let period2Id;
  let timetable1Id;

  beforeAll(async () => {
    // إنشاء مستخدم ومدرسة للتجربة
    const principalUser = await prisma.user.create({
      data: {
        email: "test_timetable_principal@test.com", passwordHash: "hashed", role: "PRINCIPAL",
        school: {
          create: { nameAr: "مدرسة الجداول", nameEn: "School", address: "بغداد" }
        }
      },
      include: { school: true }
    });
    testSchoolId = principalUser.schoolId;
    principalToken = global.generateTestToken(principalUser);

    const academicYear = await prisma.academicYear.create({
      data: { name: "Timetable Year", startDate: new Date(), endDate: new Date(), isCurrent: true, schoolId: testSchoolId }
    });
    academicYearId = academicYear.id;

    const gradeLevel = await prisma.gradeLevel.create({
      data: { nameAr: "الصف الأول", nameEn: "First Grade", sortOrder: 1 }
    });

    const schoolClass = await prisma.schoolClass.create({
      data: { nameAr: "الأول أ", nameEn: "1A", academicYearId, gradeLevelId: gradeLevel.id }
    });
    schoolClassId = schoolClass.id;

    const section1 = await prisma.section.create({
      data: { name: "شعبة أ", capacity: 10, classId: schoolClassId }
    });
    section1Id = section1.id;

    const section2 = await prisma.section.create({
      data: { name: "شعبة ب", capacity: 10, classId: schoolClassId }
    });
    section2Id = section2.id;

    const t1User = await prisma.user.create({
      data: { email: "t1@test.com", passwordHash: "123", role: "TEACHER", schoolId: testSchoolId }
    });
    const teacher1 = await prisma.teacher.create({ data: { userId: t1User.id, specialization: "Math", firstNameAr: "معلم", lastNameAr: "أول", employeeCode: "T-01" } });
    teacher1Id = teacher1.id;

    const t2User = await prisma.user.create({
      data: { email: "t2@test.com", passwordHash: "123", role: "TEACHER", schoolId: testSchoolId }
    });
    const teacher2 = await prisma.teacher.create({ data: { userId: t2User.id, specialization: "Science", firstNameAr: "معلم", lastNameAr: "ثاني", employeeCode: "T-02" } });
    teacher2Id = teacher2.id;

    const subject1 = await prisma.subject.create({ data: { nameAr: "رياضيات", nameEn: "Math", code: "MATH101" } });
    subject1Id = subject1.id;

    const subject2 = await prisma.subject.create({ data: { nameAr: "علوم", nameEn: "Science", code: "SCI101" } });
    subject2Id = subject2.id;

    const p1 = await prisma.period.create({ data: { name: "الحصة الأولى", sortOrder: 1 } });
    period1Id = p1.id;

    const p2 = await prisma.period.create({ data: { name: "الحصة الثانية", sortOrder: 2 } });
    period2Id = p2.id;
  });

  afterAll(async () => {
    if (schoolClassId) await prisma.timetableEntry.deleteMany({ where: { section: { classId: schoolClassId } } });
    const periods = [period1Id, period2Id].filter(Boolean);
    if (periods.length > 0) await prisma.period.deleteMany({ where: { id: { in: periods } } });
    if (testSchoolId) {
      await prisma.subject.deleteMany({ where: { code: { in: ["MATH101", "SCI101"] } } });
      await prisma.teacher.deleteMany({ where: { user: { schoolId: testSchoolId } } });
      await prisma.section.deleteMany({ where: { classId: schoolClassId } });
      await prisma.schoolClass.deleteMany({ where: { id: schoolClassId } });
      await prisma.gradeLevel.deleteMany({ where: { nameAr: "الصف الأول" } });
      await prisma.academicYear.deleteMany({ where: { schoolId: testSchoolId } });
      await prisma.user.deleteMany({ where: { email: { in: ["test_timetable_principal@test.com", "t1@test.com", "t2@test.com"] } } });
      await prisma.school.delete({ where: { id: testSchoolId } });
    }
  });

  it("should create a single timetable entry", async () => {
    const res = await request(app)
      .post("/api/management/timetables")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        sectionId: section1Id,
        subjectId: subject1Id,
        teacherId: teacher1Id,
        periodId: period1Id,
        dayOfWeek: "SUNDAY", // الإثنين
        academicYearId
      });
    
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    timetable1Id = res.body.data.id;
  });

  it("should block teacher conflict (same teacher, same period, different section)", async () => {
    const res = await request(app)
      .post("/api/management/timetables")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        sectionId: section2Id,
        subjectId: subject1Id,
        teacherId: teacher1Id, // نفس المعلم
        periodId: period1Id,   // نفس الحصة
        dayOfWeek: "SUNDAY",          // نفس اليوم
        academicYearId
      });
    
    if (res.body.message === "A record with the same unique value already exists.") {
      console.log("FULL ERROR RESPONSE:", res.body);
    }
    expect(res.status).toBe(409); // Conflict
    expect(res.body.message).toContain("هذا المعلم يقوم بتدريس شعبة أخرى");
  });

  it("should block section conflict (same section, same period, different subject)", async () => {
    const res = await request(app)
      .post("/api/management/timetables")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        sectionId: section1Id, // نفس الشعبة
        subjectId: subject2Id, // مادة مختلفة
        teacherId: teacher2Id, // معلم مختلف
        periodId: period1Id,   // نفس الحصة
        dayOfWeek: "SUNDAY",          // نفس اليوم
        academicYearId
      });
    
    expect(res.status).toBe(409); // Conflict
    expect(res.body.message).toContain("هذه الشعبة لديها مادة أخرى");
  });

  it("should allow teacher to teach another section at a different period", async () => {
    const res = await request(app)
      .post("/api/management/timetables")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        sectionId: section2Id,
        subjectId: subject1Id,
        teacherId: teacher1Id, // نفس المعلم
        periodId: period2Id,   // حصة مختلفة!
        dayOfWeek: "SUNDAY",
        academicYearId
      });
    
    expect(res.status).toBe(201);
  });

  it("should allow batch create timetable entries", async () => {
    const res = await request(app)
      .post("/api/management/timetables/batch")
      .set("Authorization", `Bearer ${principalToken}`)
      .send({
        entries: [
          {
            sectionId: section1Id,
            subjectId: subject2Id,
            teacherId: teacher2Id,
            periodId: period2Id, // الحصة الثانية لشعبة أ
            dayOfWeek: "SUNDAY",
            academicYearId
          },
          {
            sectionId: section1Id,
            subjectId: subject1Id,
            teacherId: teacher1Id,
            periodId: period1Id, // الحصة الأولى يوم الثلاثاء
            dayOfWeek: "MONDAY", 
            academicYearId
          }
        ]
      });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toContain("تم إنشاء 2 حصة بنجاح.");
  });

  it("should get timetable entries with filters", async () => {
    const res = await request(app)
      .get(`/api/management/timetables?teacherId=${teacher1Id}&dayOfWeek=SUNDAY`)
      .set("Authorization", `Bearer ${principalToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2); // يدرس شعبتين مختلفتين في حصتين مختلفتين
  });

  it("should update a timetable entry", async () => {
    const res = await request(app)
      .put(`/api/management/timetables/${timetable1Id}`)
      .set("Authorization", `Bearer ${principalToken}`)
      .send({ room: "Hall A" });
    
    expect(res.status).toBe(200);
    expect(res.body.data.room).toBe("Hall A");
  });

  it("should delete a timetable entry", async () => {
    const res = await request(app)
      .delete(`/api/management/timetables/${timetable1Id}`)
      .set("Authorization", `Bearer ${principalToken}`);
    
    expect(res.status).toBe(204);
  });
});
