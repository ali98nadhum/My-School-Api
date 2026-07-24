/**
 * @swagger
 * tags:
 *   name: 🛡️ النظام - المستخدمين
 *   description: مسارات إدارة مدراء المدارس والمستخدمين (مخصصة لمدير النظام Super Admin)
 */

/**
 * @swagger
 * /api/system/users:
 *   get:
 *     summary: جلب جميع المستخدمين (Get all users)
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة المستخدمين
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/system/users/principal:
 *   post:
 *     summary: إضافة مدير مدرسة جديد (Create Principal)
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - schoolId
 *               - firstNameAr
 *               - lastNameAr
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               schoolId:
 *                 type: integer
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم إضافة مدير المدرسة بنجاح
 *       400:
 *         description: خطأ في إدخال البيانات
 */

/**
 * @swagger
 * /api/system/users/{id}:
 *   get:
 *     summary: جلب مستخدم بواسطة المعرف (Get user by ID)
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المستخدم (ID)
 *     responses:
 *       200:
 *         description: تفاصيل المستخدم
 *       404:
 *         description: المستخدم غير موجود
 */

/**
 * @swagger
 * /api/system/users/principal/{id}:
 *   put:
 *     summary: تعديل بيانات مدير مدرسة (Update Principal)
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المستخدم (ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       404:
 *         description: المستخدم غير موجود
 *   delete:
 *     summary: حذف مدير مدرسة (Delete Principal)
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المستخدم (ID)
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       404:
 *         description: المستخدم غير موجود
 */
