const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");

let teacherToken;
let studentToken;
let teacherUser;
let studentUser;
let section;
let subject;
let createdHomeworkId;

beforeAll(async () => {
    // Clean up DB before test
    await prisma.homeworkSubmission.deleteMany();
    await prisma.homeworkSection.deleteMany();
    await prisma.homework.deleteMany();
    await prisma.studentEnrollment.deleteMany();
    await prisma.sectionSubjectTeacher.deleteMany();
    await prisma.section.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.schoolClass.deleteMany();
    await prisma.gradeLevel.deleteMany();
    await prisma.user.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.school.deleteMany();

    // Create school
    const school = await prisma.school.create({
        data: { nameAr: "Test School" }
    });

    const academicYear = await prisma.academicYear.create({
        data: { name: "2026", startDate: new Date(), endDate: new Date(), school: { connect: { id: school.id } }, isCurrent: true }
    });

    // Create teacher
    teacherUser = await prisma.user.create({
        data: {
            email: "teacher_hw@test.com",
            passwordHash: "hash",
            role: "TEACHER",
            schoolId: school.id,
            teacher: {
                create: {
                    firstNameAr: "معلم",
                    lastNameAr: "تست",
                    employeeCode: "T-01"
                }
            }
        },
        include: { teacher: true }
    });
    teacherToken = generateToken(teacherUser.id, "TEACHER");

    // Create student
    studentUser = await prisma.user.create({
        data: {
            email: "student_hw@test.com",
            passwordHash: "hash",
            role: "STUDENT",
            schoolId: school.id,
            student: {
                create: {
                    firstNameAr: "طالب",
                    lastNameAr: "تست",
                    studentCode: "S-01",
                    schoolId: school.id
                }
            }
        },
        include: { student: true }
    });
    studentToken = generateToken(studentUser.id, "STUDENT");

    // Create GradeLevel, Class, Section, Subject
    const gradeLevel = await prisma.gradeLevel.create({ data: { nameAr: "المرحلة الأولى", sortOrder: 1 } });
    const schoolClass = await prisma.schoolClass.create({ data: { nameAr: "الصف الأول", gradeLevel: { connect: { id: gradeLevel.id } }, academicYear: { connect: { id: academicYear.id } } } });
    
    section = await prisma.section.create({
        data: { name: "A", schoolClass: { connect: { id: schoolClass.id } } }
    });

    subject = await prisma.subject.create({
        data: { nameAr: "الرياضيات", code: "MATH-01" }
    });

    // Assign teacher to section and subject
    await prisma.sectionSubjectTeacher.create({
        data: {
            section: { connect: { id: section.id } },
            subject: { connect: { id: subject.id } },
            teacher: { connect: { id: teacherUser.teacher.id } },
            academicYear: { connect: { id: academicYear.id } }
        }
    });

    // Enroll student in section
    await prisma.studentEnrollment.create({
        data: {
            student: { connect: { id: studentUser.student.id } },
            section: { connect: { id: section.id } },
            schoolClass: { connect: { id: schoolClass.id } }
        }
    });
});

describe("Teacher & Student Homework API", () => {
    
    describe("POST /api/teacher/homeworks", () => {
        it("should create a homework for a section successfully", async () => {
            const res = await request(app)
                .post("/api/teacher/homeworks")
                .set("Authorization", `Bearer ${teacherToken}`)
                .field("sectionIds", section.id)
                .field("subjectId", subject.id)
                .field("title", "واجب الرياضيات الأول")
                .field("description", "حل الصفحة 10 كاملة")
                .field("dueDate", "2026-10-10T12:00:00Z");

            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.title).toBe("واجب الرياضيات الأول");
            
            createdHomeworkId = res.body.data.id;
        });

        it("should fail (403) if teacher tries to assign homework to section they do not teach", async () => {
            const unauthorizedSection = await prisma.section.create({
                data: { name: "B", classId: section.classId }
            });

            const res = await request(app)
                .post("/api/teacher/homeworks")
                .set("Authorization", `Bearer ${teacherToken}`)
                .field("sectionIds", unauthorizedSection.id)
                .field("subjectId", subject.id)
                .field("title", "واجب غير مصرح");

            expect(res.status).toBe(403);
        });

        it("should fail (400) if validation is incorrect", async () => {
            const res = await request(app)
                .post("/api/teacher/homeworks")
                .set("Authorization", `Bearer ${teacherToken}`)
                .field("sectionIds", section.id);

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/teacher/homeworks", () => {
        it("should fetch all homeworks for the teacher", async () => {
            const res = await request(app)
                .get("/api/teacher/homeworks")
                .set("Authorization", `Bearer ${teacherToken}`);
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe("GET /api/student/homeworks", () => {
        it("should fetch all homeworks for the student's sections", async () => {
            const res = await request(app)
                .get("/api/student/homeworks")
                .set("Authorization", `Bearer ${studentToken}`);
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            const found = res.body.data.find(h => h.id === createdHomeworkId);
            expect(found).toBeDefined();
        });
    });

    describe("PUT /api/teacher/homeworks/:id", () => {
        it("should update homework details successfully", async () => {
            const res = await request(app)
                .put(`/api/teacher/homeworks/${createdHomeworkId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({
                    title: "العنوان المعدل للواجب",
                    dueDate: "2026-11-11T12:00:00Z"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("العنوان المعدل للواجب");
        });

        it("should fail (403) if another teacher tries to update it", async () => {
            const otherTeacherUser = await prisma.user.create({
                data: {
                    email: "other_teacher_hw@test.com",
                    passwordHash: "hash",
                    role: "TEACHER",
                    schoolId: teacherUser.schoolId,
                    teacher: {
                        create: {
                            firstNameAr: "معلم 2",
                            lastNameAr: "تست",
                            employeeCode: "T-02"
                        }
                    }
                },
                include: { teacher: true }
            });
            const otherToken = generateToken(otherTeacherUser.id, "TEACHER");

            const res = await request(app)
                .put(`/api/teacher/homeworks/${createdHomeworkId}`)
                .set("Authorization", `Bearer ${otherToken}`)
                .send({ title: "اختراق" });
            
            expect(res.status).toBe(403);
        });
    });

    describe("DELETE /api/teacher/homeworks/:id", () => {
        it("should delete homework successfully", async () => {
            const res = await request(app)
                .delete(`/api/teacher/homeworks/${createdHomeworkId}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(200);

            const check = await prisma.homework.findUnique({
                where: { id: createdHomeworkId }
            });
            expect(check).toBeNull();
        });
    });
});
