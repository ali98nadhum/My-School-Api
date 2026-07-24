const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

/**
 * @desc    Get all homeworks for a student based on their current enrolled sections
 * @route   GET /api/students/homeworks
 * @access  Private (Student)
 */
exports.getStudentHomeworks = async (req, res, next) => {
    try {
        const { subjectId } = req.query;

        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        if (!student) return next(new ApiError("لم يتم العثور على بيانات الطالب", 404));
        const studentId = student.id;

        // Get student's active enrollments to find their sections
        const enrollments = await prisma.studentEnrollment.findMany({
            where: { studentId: studentId },
            select: { sectionId: true }
        });

        if (enrollments.length === 0) {
            return res.status(200).json({ status: "success", data: [] });
        }

        const sectionIds = enrollments.map(e => e.sectionId);

        const whereClause = {
            homeworkSections: {
                some: {
                    sectionId: { in: sectionIds }
                }
            }
        };

        if (subjectId) {
            whereClause.subjectId = parseInt(subjectId);
        }

        const homeworks = await prisma.homework.findMany({
            where: whereClause,
            include: {
                subject: { select: { nameAr: true } },
                teacher: { select: { firstNameAr: true, lastNameAr: true } },
                lesson: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: "success",
            data: homeworks
        });
    } catch (error) {
        next(error);
    }
};
