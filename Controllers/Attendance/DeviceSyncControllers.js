const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

exports.syncBiometricData = async (req, res, next) => {
    try {
        const { code, timestamp } = req.body;
        const punchTime = new Date(timestamp);
        
        // Ensure date is midnight of local timezone or UTC to group attendances by day
        // Standardizing date to start of the day in UTC for consistency
        const punchDate = new Date(punchTime);
        punchDate.setUTCHours(0, 0, 0, 0);

        // 1. Identify the user by searching in Student, Teacher, and StaffMember
        let userType = null;
        let referenceId = null;

        // Try Student
        const student = await prisma.student.findUnique({ where: { studentCode: code }, include: { user: true } });
        if (student) {
            userType = "STUDENT"; // Defaulting to STUDENT even if user is missing, but normally we'd check student.user.role if it exists
            referenceId = student.id;
        }

        // Try Teacher
        if (!referenceId) {
            const teacher = await prisma.teacher.findUnique({ where: { employeeCode: code }, include: { user: true } });
            if (teacher) {
                userType = "TEACHER";
                referenceId = teacher.id;
            }
        }

        // Try Staff
        if (!referenceId) {
            const staff = await prisma.staffMember.findUnique({ where: { employeeCode: code }, include: { user: true } });
            if (staff) {
                // If staff has a specific role, maybe we use that, otherwise generic STAFF
                userType = staff.user?.role || "STAFF";
                referenceId = staff.id;
            }
        }

        if (!referenceId) {
            return next(new ApiError("لم يتم العثور على مستخدم يحمل هذا الكود", 404));
        }

        // 2. Upsert DailyAttendance record
        // Check if there is already a record for this person on this date
        let dailyRecord = await prisma.dailyAttendance.findUnique({
            where: {
                date_userType_referenceId: {
                    date: punchDate,
                    userType,
                    referenceId
                }
            }
        });

        if (!dailyRecord) {
            // First punch of the day -> Check In
            dailyRecord = await prisma.dailyAttendance.create({
                data: {
                    date: punchDate,
                    userType,
                    referenceId,
                    checkInTime: punchTime,
                    status: "PRESENT" // Default to PRESENT when checked in
                }
            });
        } else {
            // Second (or subsequent) punch of the day -> Update Check Out
            // (If they punch 3 times, it keeps updating checkOutTime to the latest punch)
            dailyRecord = await prisma.dailyAttendance.update({
                where: { id: dailyRecord.id },
                data: {
                    checkOutTime: punchTime
                }
            });
        }

        res.status(200).json({
            status: "success",
            message: "تم تسجيل البصمة بنجاح",
            data: dailyRecord
        });
    } catch (error) {
        next(error);
    }
};
