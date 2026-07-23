/**
 * @swagger
 * tags:
 *   name: Management - Sections (إدارة المدرسة - الشُعب الدراسية)
 *   description: مسارات إدارة الشُعب الدراسية (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/sections:
 *   get:
 *     summary: عرض جميع الشُعب الدراسية التابعة لمدرسة المستخدم
 *     tags: [Management - Sections (إدارة المدرسة - الشُعب الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         required: false
 *         description: تصفية الشُعب التابعة لصف معين
 *     responses:
 *       200:
 *         description: قائمة الشُعب الدراسية
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/sections:
 *   post:
 *     summary: إنشاء شُعبة دراسية جديدة
 *     tags: [Management - Sections (إدارة المدرسة - الشُعب الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - name
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 1
 *                 description: معرف الصف التابعة له
 *               name:
 *                 type: string
 *                 example: "A"
 *                 description: اسم الشعبة (أ، ب، A، B)
 *               capacity:
 *                 type: integer
 *                 example: 30
 *                 description: السعة القصوى للطلاب
 *               homeroomTeacherId:
 *                 type: integer
 *                 example: 1
 *                 description: (اختياري) معرف المعلم المربي للشعبة
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *       400:
 *         description: يوجد شعبة بنفس الاسم داخل هذا الصف مسبقاً
 *       404:
 *         description: الصف أو المعلم غير موجود في مدرسة المستخدم
 */

/**
 * @swagger
 * /api/management/sections/{id}:
 *   get:
 *     summary: عرض تفاصيل شعبة محددة
 *     tags: [Management - Sections (إدارة المدرسة - الشُعب الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الشعبة
 *     responses:
 *       200:
 *         description: تفاصيل الشعبة
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/sections/{id}:
 *   put:
 *     summary: تعديل شُعبة دراسية
 *     tags: [Management - Sections (إدارة المدرسة - الشُعب الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الشعبة
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               homeroomTeacherId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/sections/{id}:
 *   delete:
 *     summary: حذف شُعبة دراسية
 *     tags: [Management - Sections (إدارة المدرسة - الشُعب الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الشعبة
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لوجود طلاب أو معلمين مرتبطين بها
 *       403:
 *         description: غير مصرح (لمدير المدرسة فقط)
 *       404:
 *         description: غير موجود
 */
