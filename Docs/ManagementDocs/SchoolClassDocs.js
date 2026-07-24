/**
 * @swagger
 * tags:
 *   name: 🏫 الإدارة - الصفوف
 *   description: مسارات إدارة الصفوف الدراسية (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/classes:
 *   get:
 *     summary: عرض جميع الصفوف الدراسية في مدرسة المستخدم
 *     tags: [🏫 الإدارة - الصفوف]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: academicYearId
 *         schema:
 *           type: integer
 *         required: false
 *         description: تصفية حسب السنة الدراسية
 *     responses:
 *       200:
 *         description: قائمة الصفوف الدراسية
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/classes:
 *   post:
 *     summary: إنشاء صف دراسي جديد (Create School Class)
 *     tags: [🏫 الإدارة - الصفوف]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gradeLevelId
 *               - academicYearId
 *             properties:
 *               gradeLevelId:
 *                 type: integer
 *                 example: 1
 *                 description: معرف المرحلة الدراسية (Global Grade Level)
 *               academicYearId:
 *                 type: integer
 *                 example: 1
 *                 description: معرف السنة الدراسية (المرتبطة بمدرسة المستخدم)
 *               nameEn:
 *                 type: string
 *                 example: "First Grade"
 *                 description: (اختياري) سيتم أخذ اسم المرحلة إن لم يحدد
 *               nameAr:
 *                 type: string
 *                 example: "الأول الابتدائي المميز"
 *                 description: (اختياري) سيتم أخذ اسم المرحلة إن لم يحدد
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *       400:
 *         description: يوجد صف لهذه المرحلة في هذه السنة مسبقاً
 *       404:
 *         description: السنة الدراسية أو المرحلة غير موجودة
 */

/**
 * @swagger
 * /api/management/classes/{id}:
 *   get:
 *     summary: عرض تفاصيل صف دراسي محدد مع الشُعب
 *     tags: [🏫 الإدارة - الصفوف]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الصف
 *     responses:
 *       200:
 *         description: تفاصيل الصف
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/classes/{id}:
 *   put:
 *     summary: تعديل اسم الصف (Update School Class)
 *     tags: [🏫 الإدارة - الصفوف]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الصف
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameEn:
 *                 type: string
 *               nameAr:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/classes/{id}:
 *   delete:
 *     summary: حذف صف دراسي (Delete School Class)
 *     tags: [🏫 الإدارة - الصفوف]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الصف
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لوجود شُعب دراسية مرتبطة
 *       403:
 *         description: غير مصرح (لمدير المدرسة فقط)
 *       404:
 *         description: غير موجود
 */
