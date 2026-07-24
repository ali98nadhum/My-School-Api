const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");
const fs = require("fs");
const path = require("path");

let teacherToken;
let teacherUser;
let teacherProfile;
let section;
let subject;
let testLessonId;

// Mock the BullMQ queue to prevent connecting to Redis during tests
vi.mock("../../utils/Queue/videoQueue", () => {
    return {
        addVideoJob: vi.fn().mockResolvedValue(true)
    };
});

// Mock image compression
vi.mock("../../utils/imageCompressor", () => {
    const mockFn = vi.fn().mockResolvedValue("mock_compressed_image.webp");
    return {
        default: mockFn,
        __esModule: true
    };
});

beforeAll(async () => {
    await prisma.lessonAttachment.deleteMany();
    await prisma.lesson.deleteMany();

    // Ensure dummy files exist for upload simulation
    const dummyDir = path.join(__dirname, "dummy");
    if (!fs.existsSync(dummyDir)) fs.mkdirSync(dummyDir, { recursive: true });
    
    fs.writeFileSync(path.join(dummyDir, "test.pdf"), "dummy pdf content");
    fs.writeFileSync(path.join(dummyDir, "test.mp4"), "dummy video content");
    
    // Create a valid 1x1 PNG image buffer for Sharp
    const validImageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    fs.writeFileSync(path.join(dummyDir, "test.jpg"), validImageBuffer);

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
            email: "teacher@test.com",
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
    teacherProfile = teacherUser.teacher;
    teacherToken = generateToken(teacherUser.id, "TEACHER", teacherUser.schoolId);

    // Create subject
    subject = await prisma.subject.create({
        data: { nameAr: "Math", code: "MATH101" }
    });

    // Create grade level
    const gradeLevel = await prisma.gradeLevel.create({
        data: { nameAr: "Grade 1", sortOrder: 1 }
    });

    // Create school class
    const schoolClass = await prisma.schoolClass.create({
        data: { nameAr: "Class 1", gradeLevel: { connect: { id: gradeLevel.id } }, academicYear: { connect: { id: academicYear.id } } }
    });

    // Create section
    section = await prisma.section.create({
        data: { name: "A", capacity: 20, schoolClass: { connect: { id: schoolClass.id } } }
    });

    // Assign teacher to section and subject
    await prisma.sectionSubjectTeacher.create({
        data: { section: { connect: { id: section.id } }, subject: { connect: { id: subject.id } }, teacher: { connect: { id: teacherProfile.id } }, academicYear: { connect: { id: academicYear.id } } }
    });
});

describe("Teacher Lesson API", () => {
    describe("POST /api/teacher/lessons", () => {
        it("should create a lesson with a YouTube link and an image cover", async () => {
            const res = await request(app)
                .post("/api/teacher/lessons")
                .set("Authorization", `Bearer ${teacherToken}`)
                .field("sectionIds", section.id)
                .field("subjectId", subject.id)
                .field("title", "الدرس الأول: مقدمة")
                .field("description", "وصف تجريبي للدرس")
                .field("youtubeUrl", "https://youtube.com/watch?v=dQw4w9WgXcQ")
                .attach("image", path.join(__dirname, "dummy/test.jpg"));

            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.data.title).toBe("الدرس الأول: مقدمة");
            expect(res.body.data.attachments).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ type: "YOUTUBE_LINK" })
                ])
            );
            testLessonId = res.body.data.id;
        });

        it("should create a lesson with a local Video and PDF", async () => {
            const res = await request(app)
                .post("/api/teacher/lessons")
                .set("Authorization", `Bearer ${teacherToken}`)
                .field("sectionIds", section.id)
                .field("subjectId", subject.id)
                .field("title", "الدرس الثاني: الملفات والفيديو")
                .attach("video", path.join(__dirname, "dummy/test.mp4"))
                .attach("pdf", path.join(__dirname, "dummy/test.pdf"));

            expect(res.status).toBe(201);
            expect(res.body.status).toBe("success");
            
            // Check attachments
            const attachments = res.body.data.attachments;
            expect(attachments.length).toBeGreaterThanOrEqual(2);
            expect(attachments.some(a => a.type === "VIDEO" && a.status === "PROCESSING")).toBe(true);
            expect(attachments.some(a => a.type === "PDF")).toBe(true);
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(app)
                .post("/api/teacher/lessons")
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({
                    sectionIds: section.id,
                    subjectId: subject.id,
                    // missing title
                });

            expect(res.status).toBe(400);
        });
    });

    describe("GET /api/teacher/lessons/sections/:sectionId", () => {
        it("should fetch all lessons for a given section", async () => {
            const res = await request(app)
                .get(`/api/teacher/lessons/sections/${section.id}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe("PUT /api/teacher/lessons/:id", () => {
        it("should update a lesson", async () => {
            const res = await request(app)
                .put(`/api/teacher/lessons/${testLessonId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({
                    title: "العنوان المحدث"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("العنوان المحدث");
        });
    });

    describe("DELETE /api/teacher/lessons/:id", () => {
        it("should delete a lesson", async () => {
            const res = await request(app)
                .delete(`/api/teacher/lessons/${testLessonId}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(200);

            // Verify deletion
            const deleted = await prisma.lesson.findUnique({ where: { id: testLessonId } });
            expect(deleted).toBeNull();
        });
    });
});
