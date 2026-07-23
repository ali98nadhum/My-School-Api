/**
 * @swagger
 * tags:
 *   name: Management - Staff (إدارة المدرسة - الموظفين)
 *   description: مسارات إدارة الموظفين داخل المدرسة (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/staff:
 *   get:
 *     summary: عرض جميع الموظفين (Get all staff)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: رقم الصفحة
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: عدد النتائج في الصفحة
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: البحث بالاسم أو البريد
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [TEACHER, ADMINISTRATOR, ACCOUNTANT]
 *         description: فلترة حسب الدور
 *     responses:
 *       200:
 *         description: قائمة الموظفين
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/staff/admin:
 *   post:
 *     summary: إضافة موظف إداري جديد (Add Administrator)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
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
 *               - firstNameAr
 *               - lastNameAr
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
 *       201:
 *         description: تم الإضافة بنجاح
 */

/**
 * @swagger
 * /api/management/staff/accountant:
 *   post:
 *     summary: إضافة محاسب جديد (Add Accountant)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
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
 *               - firstNameAr
 *               - lastNameAr
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
 *       201:
 *         description: تم الإضافة بنجاح
 */

/**
 * @swagger
 * /api/management/staff/teacher:
 *   post:
 *     summary: إضافة معلم جديد (Add Teacher)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
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
 *               - firstNameAr
 *               - lastNameAr
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 */

/**
 * @swagger
 * /api/management/staff/{id}:
 *   put:
 *     summary: تعديل بيانات موظف (Update Staff)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الموظف (User ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/staff/{id}:
 *   delete:
 *     summary: حذف موظف (Delete Staff)
 *     tags: [Management - Staff (إدارة المدرسة - الموظفين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف الموظف (User ID)
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       403:
 *         description: غير مصرح
 */
