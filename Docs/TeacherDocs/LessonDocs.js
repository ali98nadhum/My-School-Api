/**
 * @swagger
 * tags:
 *   name: Teacher - Lessons
 *   description: إدارة الدروس من قبل المعلم
 */

/**
 * @swagger
 * /api/teacher/lessons:
 *   post:
 *     summary: إنشاء درس جديد
 *     tags: [Teacher - Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - sectionIds
 *               - subjectId
 *               - title
 *             properties:
 *               sectionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: معرفات الشعب (يمكن إرسالها مفصولة بفواصل أو كمصفوفة)
 *               subjectId:
 *                 type: integer
 *                 description: معرف المادة
 *               title:
 *                 type: string
 *                 description: عنوان الدرس
 *               description:
 *                 type: string
 *                 description: وصف الدرس (اختياري)
 *               lessonDate:
 *                 type: string
 *                 format: date
 *                 description: تاريخ الدرس (اختياري)
 *               youtubeUrl:
 *                 type: string
 *                 description: رابط يوتيوب (اختياري)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: صورة غلاف للدرس (اختياري)
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: فيديو الدرس (يعالج في الخلفية، أقصى مدة 60 دقيقة)
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: ملف PDF مرفق للدرس
 *     responses:
 *       201:
 *         description: تم إنشاء الدرس بنجاح
 *       400:
 *         description: بيانات غير صحيحة
 */

/**
 * @swagger
 * /api/teacher/lessons/sections/{sectionId}:
 *   get:
 *     summary: جلب دروس شعبة معينة
 *     tags: [Teacher - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: معرف الشعبة
 *     responses:
 *       200:
 *         description: تم الجلب بنجاح
 */

/**
 * @swagger
 * /api/teacher/lessons/{id}:
 *   put:
 *     summary: تعديل درس
 *     tags: [Teacher - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               lessonDate:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: تم التحديث
 *   delete:
 *     summary: حذف درس
 *     tags: [Teacher - Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: تم الحذف
 */
