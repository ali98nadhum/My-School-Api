const request = require("supertest");
const app = require("../../index");
const { prisma } = require("../../config/prismaClient");
const { generateToken } = require("../../utils/Auth/generateToken");

let adminToken;
let teacherUser;
let studentUser;

beforeAll(async () => {
    await prisma.dailyAttendance.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();

    const school = await prisma.school.create({ data: { nameAr: "Test School" } });

    // Create Admin
    const adminUser = await prisma.user.create({
        data: {
            email: "admin_att@test.com", passwordHash: "hash", role: "PRINCIPAL", schoolId: school.id
        }
    });
    adminToken = generateToken(adminUser.id, "PRINCIPAL");

    // Create teacher
    teacherUser = await prisma.user.create({
        data: {
            email: "t_att@test.com", passwordHash: "hash", role: "TEACHER", schoolId: school.id,
            teacher: { create: { firstNameAr: "معلم", employeeCode: "T-100" } }
        },
        include: { teacher: true }
    });

    // Create student
    studentUser = await prisma.user.create({
        data: {
            email: "s_att@test.com", passwordHash: "hash", role: "STUDENT", schoolId: school.id,
            student: { create: { firstNameAr: "طالب", studentCode: "S-100", school: { connect: { id: school.id } } } }
        },
        include: { student: true }
    });
});

describe("Biometric Attendance API", () => {
    describe("POST /api/device/sync", () => {
        it("should register Check-In for Teacher on first punch", async () => {
            const res = await request(app)
                .post("/api/device/sync")
                .send({
                    code: "T-100",
                    timestamp: "2026-10-10T08:00:00Z"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.userType).toBe("TEACHER");
            expect(res.body.data.checkInTime).toBe("2026-10-10T08:00:00.000Z");
            expect(res.body.data.checkOutTime).toBeNull();
        });

        it("should register Check-Out for Teacher on second punch", async () => {
            const res = await request(app)
                .post("/api/device/sync")
                .send({
                    code: "T-100",
                    timestamp: "2026-10-10T14:00:00Z"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.checkOutTime).toBe("2026-10-10T14:00:00.000Z");
        });

        it("should register Check-In for Student", async () => {
            const res = await request(app)
                .post("/api/device/sync")
                .send({
                    code: "S-100",
                    timestamp: "2026-10-10T07:30:00Z"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.userType).toBe("STUDENT");
        });

        it("should fail (404) if code does not exist", async () => {
            const res = await request(app)
                .post("/api/device/sync")
                .send({
                    code: "UNKNOWN-CODE",
                    timestamp: "2026-10-10T07:30:00Z"
                });

            expect(res.status).toBe(404);
        });
    });

    describe("GET /api/management/attendance-reports/daily", () => {
        it("should fetch all daily attendances", async () => {
            const res = await request(app)
                .get("/api/management/attendance-reports/daily?date=2026-10-10")
                .set("Authorization", `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2); // 1 teacher + 1 student
        });

        it("should filter by userType (STUDENT)", async () => {
            const res = await request(app)
                .get("/api/management/attendance-reports/daily?date=2026-10-10&userType=STUDENT")
                .set("Authorization", `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].userType).toBe("STUDENT");
        });
    });
});
