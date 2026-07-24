/**
 * @swagger
 * tags:
 *   name: 🏫 الإدارة - المراحل الدراسية
 *   description: مسارات إدارة المراحل الدراسية (مخصصة لمدير النظام Super Admin، قراءة فقط لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/system/grade-levels:
 *   get:
 *     summary: عرض جميع المراحل الدراسية
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة المراحل الدراسية
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/system/grade-levels:
 *   post:
 *     summary: إضافة مرحلة دراسية جديدة
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameEn
 *               - nameAr
 *               - sortOrder
 *             properties:
 *               nameEn:
 *                 type: string
 *                 example: "First Grade"
 *               nameAr:
 *                 type: string
 *                 example: "الأول الابتدائي"
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *       400:
 *         description: بيانات خاطئة أو الترتيب مكرر
 */

/**
 * @swagger
 * /api/system/grade-levels/{id}:
 *   put:
 *     summary: تعديل مرحلة دراسية
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المرحلة
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
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/system/grade-levels/{id}:
 *   delete:
 *     summary: حذف مرحلة دراسية
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المرحلة
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لوجود ارتباطات (صفوف أو رسوم)
 *       404:
 *         description: غير موجود
 */
