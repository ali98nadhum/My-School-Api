const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

exports.getHomeworkSubmissions = async (req, res, next) => {
    try {
        const { homeworkId } = req.params;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));

        const homework = await prisma.homework.findUnique({
            where: { id: parseInt(homeworkId) }
        });

        if (!homework) return next(new ApiError("الواجب غير موجود", 404));

        if (homework.teacherId !== teacher.id) {
            return next(new ApiError("ليس لديك صلاحية لرؤية تسليمات هذا الواجب", 403));
        }

        const submissions = await prisma.homeworkSubmission.findMany({
            where: { homeworkId: parseInt(homeworkId) },
            include: {
                student: {
                    select: {
                        firstNameAr: true,
                        lastNameAr: true,
                        studentCode: true
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        res.status(200).json({
            status: "success",
            results: submissions.length,
            data: submissions
        });
    } catch (error) {
        next(error);
    }
};

exports.gradeSubmission = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback } = req.body;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));

        const submission = await prisma.homeworkSubmission.findUnique({
            where: { id: parseInt(submissionId) },
            include: {
                homework: true
            }
        });

        if (!submission) {
            return next(new ApiError("التسليم غير موجود", 404));
        }

        if (submission.homework.teacherId !== teacher.id) {
            return next(new ApiError("ليس لديك صلاحية لتصحيح هذا الواجب", 403));
        }

        const updatedSubmission = await prisma.homeworkSubmission.update({
            where: { id: parseInt(submissionId) },
            data: {
                score,
                feedback,
                status: "GRADED",
                gradedBy: req.user.id,
                gradedAt: new Date()
            }
        });

        res.status(200).json({
            status: "success",
            data: updatedSubmission
        });
    } catch (error) {
        next(error);
    }
};
