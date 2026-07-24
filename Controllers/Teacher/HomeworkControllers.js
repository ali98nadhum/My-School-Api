const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");
const fs = require("fs");

/**
 * @desc    Create a new homework
 * @route   POST /api/teacher/homeworks
 * @access  Private (Teacher)
 */
exports.createHomework = async (req, res, next) => {
    try {
        const { sectionIds, subjectId, lessonId, title, description, dueDate } = req.body;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        // Verify sections exist
        const sections = await prisma.section.findMany({
            where: { id: { in: sectionIds } }
        });
        if (sections.length !== sectionIds.length) return next(new ApiError("بعض الشعب غير موجودة", 404));

        // Verify teacher belongs to ALL sections for this subject
        const teacherSectionSubjects = await prisma.sectionSubjectTeacher.findMany({
            where: {
                sectionId: { in: sectionIds },
                subjectId: subjectId,
                teacherId: teacherId
            }
        });

        if (teacherSectionSubjects.length !== sectionIds.length) {
            return next(new ApiError("ليس لديك صلاحية لإعطاء واجب لهذه المادة في جميع الشعب المحددة", 403));
        }

        let attachmentUrl = null;
        if (req.file) {
            attachmentUrl = `uploads/docs/homeworks/${req.file.filename}`;
        }

        const homework = await prisma.homework.create({
            data: {
                title,
                description,
                subjectId,
                teacherId,
                lessonId: lessonId || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                attachmentUrl,
                homeworkSections: {
                    create: sectionIds.map(id => ({ sectionId: id }))
                }
            },
            include: { homeworkSections: true }
        });

        res.status(201).json({
            status: "success",
            data: homework
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all homeworks for a teacher (filtered optionally by section or subject)
 * @route   GET /api/teacher/homeworks
 * @access  Private (Teacher)
 */
exports.getTeacherHomeworks = async (req, res, next) => {
    try {
        const { sectionId, subjectId } = req.query;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const whereClause = {
            teacherId: teacherId
        };

        if (sectionId) {
            whereClause.homeworkSections = { some: { sectionId: parseInt(sectionId) } };
        }
        if (subjectId) {
            whereClause.subjectId = parseInt(subjectId);
        }

        const homeworks = await prisma.homework.findMany({
            where: whereClause,
            include: {
                subject: { select: { nameAr: true } },
                lesson: { select: { title: true } },
                homeworkSections: {
                    include: {
                        section: { select: { id: true, name: true, schoolClass: { select: { nameAr: true } } } }
                    }
                }
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

/**
 * @desc    Update a homework
 * @route   PUT /api/teacher/homeworks/:id
 * @access  Private (Teacher)
 */
exports.updateHomework = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const homework = await prisma.homework.findUnique({
            where: { id: parseInt(id) }
        });

        if (!homework) return next(new ApiError("الواجب غير موجود", 404));
        if (homework.teacherId !== teacherId) return next(new ApiError("لا تملك صلاحية تعديل هذا الواجب", 403));

        const updatedHomework = await prisma.homework.update({
            where: { id: parseInt(id) },
            data: {
                title: title !== undefined ? title : homework.title,
                description: description !== undefined ? description : homework.description,
                dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : homework.dueDate
            }
        });

        res.status(200).json({
            status: "success",
            data: updatedHomework
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a homework
 * @route   DELETE /api/teacher/homeworks/:id
 * @access  Private (Teacher)
 */
exports.deleteHomework = async (req, res, next) => {
    try {
        const { id } = req.params;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const homework = await prisma.homework.findUnique({
            where: { id: parseInt(id) }
        });

        if (!homework) return next(new ApiError("الواجب غير موجود", 404));
        if (homework.teacherId !== teacherId) return next(new ApiError("لا تملك صلاحية حذف هذا الواجب", 403));

        if (homework.attachmentUrl) {
            const filePath = homework.attachmentUrl;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.homework.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            status: "success",
            message: "تم حذف الواجب بنجاح"
        });
    } catch (error) {
        next(error);
    }
};
