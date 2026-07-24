/**
 * @swagger
 * tags:
 *   name: 👨‍🏫 المعلم - الواجباتs
 *   description: إدارة الواجبات الخاصة بالمعلم
 */

/**
 * @swagger
 * /api/teacher/homeworks:
 *   post:
 *     summary: إنشاء واجب جديد وتعيينه لشعبة واحدة أو عدة شعب
 *     tags: [Teacher - Homeworks]
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
 *               lessonId:
 *                 type: integer
 *                 description: معرف الدرس المرتبط (اختياري)
 *               title:
 *                 type: string
 *                 description: عنوان الواجب
 *               description:
 *                 type: string
 *                 description: وصف تفصيلي للواجب
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: موعد التسليم
 *               attachment:
 *                 type: string
 *                 format: binary
 *                 description: ملف الواجب (صورة أو PDF)
 *     responses:
 *       201:
 *         description: تم إنشاء الواجب بنجاح
 *       400:
 *         description: أخطاء في البيانات المرسلة
 *       403:
 *         description: لا توجد صلاحية
 *       404:
 *         description: لم يتم العثور على المعلم أو الشعب
 *
 *   get:
 *     summary: جلب الواجبات الخاصة بالمعلم
 *     tags: [Teacher - Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *         description: التصفية حسب الشعبة (اختياري)
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: integer
 *         description: التصفية حسب المادة (اختياري)
 *     responses:
 *       200:
 *         description: قائمة الواجبات
 */

/**
 * @swagger
 * /api/teacher/homeworks/{id}:
 *   put:
 *     summary: تعديل بيانات الواجب
 *     tags: [Teacher - Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: معرف الواجب
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: تم تعديل الواجب
 *
 *   delete:
 *     summary: حذف الواجب
 *     tags: [Teacher - Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: معرف الواجب
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 */
