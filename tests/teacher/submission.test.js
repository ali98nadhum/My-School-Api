const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");
const fs = require("fs");
const path = require("path");

let teacherToken;
let studentToken;
let otherStudentToken;
let otherTeacherToken;
let teacherUser;
let studentUser;
let otherStudentUser;
let section;
let subject;
let createdHomeworkId;
let createdSubmissionId;

beforeAll(async () => {
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

    const dummyDir = path.join(__dirname, "dummy");
    if (!fs.existsSync(dummyDir)) fs.mkdirSync(dummyDir, { recursive: true });
    fs.writeFileSync(path.join(dummyDir, "solution.pdf"), "dummy pdf solution");

    const school = await prisma.school.create({ data: { nameAr: "Test School" } });
    const academicYear = await prisma.academicYear.create({
        data: { name: "2026", startDate: new Date(), endDate: new Date(), school: { connect: { id: school.id } }, isCurrent: true }
    });

    // Create teacher
    teacherUser = await prisma.user.create({
        data: {
            email: "t_sub@test.com", passwordHash: "hash", role: "TEACHER", schoolId: school.id,
            teacher: { create: { firstNameAr: "معلم", lastNameAr: "تست", employeeCode: "T-SUB" } }
        },
        include: { teacher: true }
    });
    teacherToken = generateToken(teacherUser.id, "TEACHER");

    // Create other teacher
    const otherTeacherUser = await prisma.user.create({
        data: {
            email: "t2_sub@test.com", passwordHash: "hash", role: "TEACHER", schoolId: school.id,
            teacher: { create: { firstNameAr: "معلم", lastNameAr: "آخر", employeeCode: "T-SUB2" } }
        },
        include: { teacher: true }
    });
    otherTeacherToken = generateToken(otherTeacherUser.id, "TEACHER");

    // Create student
    studentUser = await prisma.user.create({
        data: {
            email: "s_sub@test.com", passwordHash: "hash", role: "STUDENT", schoolId: school.id,
            student: { create: { firstNameAr: "طالب", lastNameAr: "تست", studentCode: "S-SUB", school: { connect: { id: school.id } } } }
        },
        include: { student: true }
    });
    studentToken = generateToken(studentUser.id, "STUDENT");

    otherStudentUser = await prisma.user.create({
        data: {
            email: "s2_sub@test.com", passwordHash: "hash", role: "STUDENT", schoolId: school.id,
            student: { create: { firstNameAr: "طالب2", lastNameAr: "آخر", studentCode: "S-SUB2", school: { connect: { id: school.id } } } }
        },
        include: { student: true }
    });
    otherStudentToken = generateToken(otherStudentUser.id, "STUDENT");

    const gradeLevel = await prisma.gradeLevel.create({ data: { nameAr: "المرحلة", sortOrder: 5 } });
    const schoolClass = await prisma.schoolClass.create({ data: { nameAr: "الصف", gradeLevel: { connect: { id: gradeLevel.id } }, academicYear: { connect: { id: academicYear.id } } } });

    section = await prisma.section.create({ data: { name: "A", schoolClass: { connect: { id: schoolClass.id } } } });
    const otherSection = await prisma.section.create({ data: { name: "B", schoolClass: { connect: { id: schoolClass.id } } } });
    subject = await prisma.subject.create({ data: { nameAr: "فيزياء", code: "PHY-01" } });

    await prisma.sectionSubjectTeacher.create({
        data: {
            section: { connect: { id: section.id } },
            subject: { connect: { id: subject.id } },
            teacher: { connect: { id: teacherUser.teacher.id } },
            academicYear: { connect: { id: academicYear.id } }
        }
    });

    await prisma.studentEnrollment.create({
        data: {
            student: { connect: { id: studentUser.student.id } },
            section: { connect: { id: section.id } },
            schoolClass: { connect: { id: schoolClass.id } }
        }
    });

    await prisma.studentEnrollment.create({
        data: {
            student: { connect: { id: otherStudentUser.student.id } },
            section: { connect: { id: otherSection.id } },
            schoolClass: { connect: { id: schoolClass.id } }
        }
    });

    // Create Homework manually
    const homework = await prisma.homework.create({
        data: {
            title: "واجب الفيزياء",
            subjectId: subject.id,
            teacherId: teacherUser.teacher.id,
            homeworkSections: {
                create: [{ sectionId: section.id }]
            }
        }
    });
    createdHomeworkId = homework.id;
});

describe("Student & Teacher Submissions API", () => {

    describe("POST /api/student/homeworks/:homeworkId/submissions", () => {
        it("should allow a student to submit their homework", async () => {
            const res = await request(app)
                .post(`/api/student/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${studentToken}`)
                .attach("attachment", path.join(__dirname, "dummy/solution.pdf"));

            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.status).toBe("SUBMITTED");

            createdSubmissionId = res.body.data.id;
        });

        it("should fail (400) if student tries to submit again", async () => {
            const res = await request(app)
                .post(`/api/student/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${studentToken}`)
                .attach("attachment", path.join(__dirname, "dummy/solution.pdf"));

            expect(res.status).toBe(400);
        });

        it("should fail (403) if student is not in the assigned section", async () => {
            const res = await request(app)
                .post(`/api/student/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${otherStudentToken}`)
                .attach("attachment", path.join(__dirname, "dummy/solution.pdf"));

            expect(res.status).toBe(403);
        });
    });

    describe("GET /api/student/homeworks/:homeworkId/submissions", () => {
        it("should fetch the student's submission details", async () => {
            const res = await request(app)
                .get(`/api/student/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(createdSubmissionId);
        });
    });

    describe("GET /api/teacher/homeworks/:homeworkId/submissions", () => {
        it("should fetch all submissions for the teacher's homework", async () => {
            const res = await request(app)
                .get(`/api/teacher/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].id).toBe(createdSubmissionId);
        });

        it("should fail (403) if another teacher tries to fetch submissions", async () => {
            const res = await request(app)
                .get(`/api/teacher/homeworks/${createdHomeworkId}/submissions`)
                .set("Authorization", `Bearer ${otherTeacherToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe("PUT /api/teacher/submissions/:submissionId/grade", () => {
        it("should grade the submission successfully", async () => {
            const res = await request(app)
                .put(`/api/teacher/submissions/${createdSubmissionId}/grade`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({
                    score: 95,
                    feedback: "عمل ممتاز!"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.score).toBe("95");
            expect(res.body.data.feedback).toBe("عمل ممتاز!");
            expect(res.body.data.status).toBe("GRADED");
        });

        it("should fail (403) if another teacher tries to grade it", async () => {
            const res = await request(app)
                .put(`/api/teacher/submissions/${createdSubmissionId}/grade`)
                .set("Authorization", `Bearer ${otherTeacherToken}`)
                .send({ score: 50 });

            expect(res.status).toBe(403);
        });

        it("should fail (400) if validation is incorrect (score > 100)", async () => {
            const res = await request(app)
                .put(`/api/teacher/submissions/${createdSubmissionId}/grade`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ score: 105 });

            expect(res.status).toBe(400);
        });
    });
});
