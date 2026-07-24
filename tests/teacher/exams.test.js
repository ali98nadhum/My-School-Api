const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");
const bcrypt = require("bcryptjs");

describe("Teacher Exam Routes", () => {
  let teacherToken;
  let otherTeacherToken;
  let schoolId;
  let teacherId;
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

    const hashedPassword = await bcrypt.hash("123456", 10);
    
    // 2. Setup Main Teacher
    const teacherEmail1 = `teacher1_${Date.now()}@test.com`;
    const teacherUser = await prisma.user.create({
      data: {
        email: teacherEmail1,
        passwordHash: hashedPassword,
        role: "TEACHER",
        schoolId
      }
    });
    
    const teacher = await prisma.teacher.create({
      data: { userId: teacherUser.id, employeeCode: "T001" }
    });
    teacherId = teacher.id;
    teacherToken = generateToken(teacherUser.id, "TEACHER");

    // 3. Setup Other Teacher
    const teacherEmail2 = `teacher2_${Date.now()}@test.com`;
    const otherTeacherUser = await prisma.user.create({
      data: {
        email: teacherEmail2,
        passwordHash: hashedPassword,
        role: "TEACHER",
        schoolId
      }
    });
    await prisma.teacher.create({
      data: { userId: otherTeacherUser.id, employeeCode: "T002" }
    });
    otherTeacherToken = generateToken(otherTeacherUser.id, "TEACHER");

    // 4. Setup Academic Structure
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

    // 5. Setup Exam Type
    const eType = await prisma.examType.create({
      data: { nameAr: "امتحان يومي", weightPercentage: 5 }
    });
    examTypeId = eType.id;
    
    const period = await prisma.period.create({ data: { name: "1st", sortOrder: Math.floor(Math.random() * 10000) } });

    // 6. Assign subject and section to main teacher
    await prisma.sectionSubjectTeacher.create({
      data: { teacherId, subjectId, sectionId, academicYearId }
    });

    await prisma.timetableEntry.create({
      data: {
        teacherId,
        sectionId,
        subjectId,
        academicYearId,
        dayOfWeek: "MONDAY",
        periodId: period.id
      }
    });
  });

  afterEach(async () => {
    await prisma.timetableEntry.deleteMany();
    await prisma.period.deleteMany();
    await prisma.sectionSubjectTeacher.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.examType.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.section.deleteMany();
    await prisma.schoolClass.deleteMany();
    await prisma.gradeLevel.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
  });

  it("should create an exam successfully (Teacher)", async () => {
    const res = await request(app)
      .post("/api/teacher/exams")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        academicYearId,
        examTypeId,
        subjectId,
        sectionId,
        examDate: "2025-05-15",
        maxScore: 10,
        passingScore: 5
      });

    expect(res.status).toBe(201);
    expect(res.body.data.subjectId).toBe(subjectId);
  });

  it("should fail to create exam if teacher does not teach the subject", async () => {
    const res = await request(app)
      .post("/api/teacher/exams")
      .set("Authorization", `Bearer ${otherTeacherToken}`)
      .send({
        academicYearId,
        examTypeId,
        subjectId,
        sectionId
      });

    // otherTeacher does not have teacherSubject relation for subjectId
    expect(res.status).toBe(403);
    expect(res.body.message).toContain("أنت لا تدرس هذه المادة لهذه الشعبة");
  });

  it("should fail to create exam if teacher does not teach the section", async () => {
    // We create another section
    const otherSection = await prisma.section.create({
      data: { name: "B", classId }
    });

    const res = await request(app)
      .post("/api/teacher/exams")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        academicYearId,
        examTypeId,
        subjectId,
        sectionId: otherSection.id
      });

    // main teacher teaches subject, but timetable does not map them to section B
    expect(res.status).toBe(403);
    expect(res.body.message).toContain("أنت لا تدرس هذه المادة لهذه الشعبة");
  });
});
