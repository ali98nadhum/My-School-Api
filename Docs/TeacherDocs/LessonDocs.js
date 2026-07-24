/**
 * @swagger
 * /api/teacher/lessons:
 *   post:
 *     summary: إنشاء درس جديد
 *     operationId: createLesson
 *     tags: [👨‍🏫 المعلم - الدروس]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateLessonRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء الدرس بنجاح (قد تستمر معالجة الفيديو في الخلفية إن وُجد)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonResponse'
 *       400:
 *         description: بيانات غير صحيحة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: ليس لديك صلاحية لرفع درس لهذه المادة في جميع الشعب المحددة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: لم يتم العثور على المعلم أو بعض الشعب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/teacher/lessons/sections/{sectionId}:
 *   get:
 *     summary: جلب دروس شعبة معينة
 *     operationId: getSectionLessons
 *     tags: [👨‍🏫 المعلم - الدروس]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/LessonSectionIdParam'
 *     responses:
 *       200:
 *         description: تم الجلب بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: لم يتم العثور على بيانات المعلم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/teacher/lessons/{id}:
 *   put:
 *     summary: تعديل درس (لا يشمل تعديل مرفقات الفيديو أو PDF)
 *     operationId: updateLesson
 *     tags: [👨‍🏫 المعلم - الدروس]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/LessonIdParam'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLessonRequest'
 *     responses:
 *       200:
 *         description: تم التحديث
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: الدرس غير موجود أو لا تملك صلاحية تعديله
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف درس
 *     operationId: deleteLesson
 *     tags: [👨‍🏫 المعلم - الدروس]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/LessonIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: الدرس غير موجود أو لا تملك صلاحية حذفه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
