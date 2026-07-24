const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");
const compressImage = require("../../utils/imageCompressor");
const { addVideoJob } = require("../../utils/Queue/videoQueue");

/**
 * @desc    Create a new lesson
 * @route   POST /api/teacher/lessons
 * @access  Private (Teacher)
 */
exports.createLesson = async (req, res, next) => {
    try {
        const { sectionIds, subjectId, title, description, lessonDate, youtubeUrl } = req.body;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        // Verify teacher belongs to the academic year and has access
        const sections = await prisma.section.findMany({
            where: { id: { in: sectionIds } },
            include: { schoolClass: true }
        });

        if (sections.length !== sectionIds.length) return next(new ApiError("بعض الشعب غير موجودة", 404));

        const teacherSectionSubjects = await prisma.sectionSubjectTeacher.findMany({
            where: {
                sectionId: { in: sectionIds },
                subjectId: subjectId,
                teacherId: teacherId
            }
        });

        if (teacherSectionSubjects.length !== sectionIds.length) {
            return next(new ApiError("ليس لديك صلاحية لرفع درس لهذه المادة في جميع الشعب المحددة", 403));
        }

        let imageUrl = null;
        let attachmentsData = [];

        // 1. Handle Cover Image
        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];
            const compressedName = await compressImage(imageFile.path, imageFile.filename, {
                outputDir: "uploads/images/lessons",
                width: 1200,
                quality: 80
            });
            imageUrl = `uploads/images/lessons/${compressedName}`;
        }

        // 2. Prepare Attachments (PDF)
        if (req.files && req.files.pdf && req.files.pdf[0]) {
            attachmentsData.push({
                type: "PDF",
                url: req.files.pdf[0].path,
                name: req.files.pdf[0].originalname,
                status: "READY"
            });
        }

        // 3. Prepare Attachments (YouTube)
        if (youtubeUrl) {
            attachmentsData.push({
                type: "YOUTUBE_LINK",
                url: youtubeUrl,
                name: "YouTube Video",
                status: "READY"
            });
        }

        // 4. Create the Lesson along with ready attachments
        const lesson = await prisma.lesson.create({
            data: {
                subjectId: subjectId,
                teacherId: teacherId,
                academicYearId: sections[0].schoolClass.academicYearId,
                title: title,
                description: description,
                lessonDate: lessonDate ? new Date(lessonDate) : null,
                imageUrl: imageUrl,
                attachments: {
                    create: attachmentsData
                },
                lessonSections: {
                    create: sectionIds.map(id => ({ sectionId: id }))
                }
            },
            include: { attachments: true }
        });

        // 5. Handle Video (Async Processing)
        if (req.files && req.files.video && req.files.video[0]) {
            const videoFile = req.files.video[0];

            // Create attachment record as PROCESSING
            const videoAttachment = await prisma.lessonAttachment.create({
                data: {
                    lessonId: lesson.id,
                    type: "VIDEO",
                    url: videoFile.path, // Temporary path
                    name: videoFile.originalname,
                    status: "PROCESSING"
                }
            });

            // Trigger background processing for video using BullMQ
            await addVideoJob(videoFile.path, videoAttachment.id);

            lesson.attachments.push(videoAttachment);
        }

        res.status(201).json({
            status: "success",
            message: "تم إنشاء الدرس بنجاح" + (req.files?.video ? " (جاري معالجة الفيديو في الخلفية)" : ""),
            data: lesson
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get lessons for a specific section
 * @route   GET /api/teacher/lessons/sections/:sectionId
 * @access  Private (Teacher)
 */
exports.getSectionLessons = async (req, res, next) => {
    try {
        const { sectionId } = req.params;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const lessons = await prisma.lesson.findMany({
            where: {
                lessonSections: {
                    some: {
                        sectionId: parseInt(sectionId)
                    }
                },
                teacherId: parseInt(teacherId)
            },
            include: {
                attachments: true,
                subject: {
                    select: { nameAr: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: "success",
            data: lessons
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an existing lesson (Does not update attachments)
 * @route   PUT /api/teacher/lessons/:id
 * @access  Private (Teacher)
 */
exports.updateLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, lessonDate } = req.body;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const existingLesson = await prisma.lesson.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingLesson || existingLesson.teacherId !== teacherId) {
            return next(new ApiError("الدرس غير موجود أو لا تملك صلاحية تعديله", 404));
        }

        let imageUrl = existingLesson.imageUrl;

        // Handle Cover Image Update
        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];
            const compressedName = await compressImage(imageFile.path, imageFile.filename, {
                outputDir: "uploads/images/lessons",
                width: 1200,
                quality: 80
            });
            imageUrl = `uploads/images/lessons/${compressedName}`;
        }

        const updatedLesson = await prisma.lesson.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                lessonDate: lessonDate ? new Date(lessonDate) : undefined,
                imageUrl
            }
        });

        res.status(200).json({
            status: "success",
            message: "تم تحديث الدرس بنجاح",
            data: updatedLesson
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a lesson
 * @route   DELETE /api/teacher/lessons/:id
 * @access  Private (Teacher)
 */
exports.deleteLesson = async (req, res, next) => {
    try {
        const { id } = req.params;

        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
        if (!teacher) return next(new ApiError("لم يتم العثور على بيانات المعلم", 404));
        const teacherId = teacher.id;

        const existingLesson = await prisma.lesson.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingLesson || existingLesson.teacherId !== teacherId) {
            return next(new ApiError("الدرس غير موجود أو لا تملك صلاحية حذفه", 404));
        }

        await prisma.lesson.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            status: "success",
            message: "تم حذف الدرس بنجاح"
        });
    } catch (error) {
        next(error);
    }
};
