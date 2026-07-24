const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

exports.submitHomework = async (req, res, next) => {
    try {
        const { homeworkId } = req.params;

        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        if (!student) return next(new ApiError("لم يتم العثور على بيانات الطالب", 404));

        const homework = await prisma.homework.findUnique({
            where: { id: parseInt(homeworkId) },
            include: {
                homeworkSections: true
            }
        });

        if (!homework) return next(new ApiError("الواجب غير موجود", 404));

        const homeworkSectionIds = homework.homeworkSections.map(hs => hs.sectionId);

        const enrollment = await prisma.studentEnrollment.findFirst({
            where: {
                studentId: student.id,
                sectionId: { in: homeworkSectionIds },
                status: "ACTIVE"
            }
        });

        if (!enrollment) {
            return next(new ApiError("ليس لديك صلاحية لتسليم هذا الواجب لأنه غير مخصص لشعبتك", 403));
        }

        const existingSubmission = await prisma.homeworkSubmission.findUnique({
            where: {
                homeworkId_studentId: {
                    homeworkId: homework.id,
                    studentId: student.id
                }
            }
        });

        if (existingSubmission) {
            return next(new ApiError("لقد قمت بتسليم هذا الواجب مسبقاً", 400));
        }

        let status = "SUBMITTED";
        const now = new Date();
        if (homework.dueDate && now > new Date(homework.dueDate)) {
            status = "LATE";
        }

        let fileUrl = null;
        if (req.file) {
            fileUrl = `/uploads/homeworks/${req.file.filename}`;
        } else if (req.body.fileUrl) {
            fileUrl = req.body.fileUrl;
        }

        if (!fileUrl) {
            return next(new ApiError("يجب إرفاق ملف الحل", 400));
        }

        const submission = await prisma.homeworkSubmission.create({
            data: {
                homeworkId: homework.id,
                studentId: student.id,
                submittedAt: now,
                fileUrl,
                status
            }
        });

        res.status(201).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        next(error);
    }
};

exports.getMySubmission = async (req, res, next) => {
    try {
        const { homeworkId } = req.params;

        const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
        if (!student) return next(new ApiError("لم يتم العثور على بيانات الطالب", 404));

        const submission = await prisma.homeworkSubmission.findUnique({
            where: {
                homeworkId_studentId: {
                    homeworkId: parseInt(homeworkId),
                    studentId: student.id
                }
            },
            include: {
                gradedByUser: {
                    select: {
                        teacher: {
                            select: {
                                firstNameAr: true,
                                lastNameAr: true
                            }
                        }
                    }
                }
            }
        });

        if (!submission) {
            return next(new ApiError("لم تقم بتسليم هذا الواجب بعد", 404));
        }

        res.status(200).json({
            status: "success",
            data: submission
        });
    } catch (error) {
        next(error);
    }
};
