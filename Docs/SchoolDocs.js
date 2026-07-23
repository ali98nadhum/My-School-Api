/**
 * @swagger
 * tags:
 *   name: System Admin - Schools (إدارة النظام - المدارس)
 *   description: مسارات إدارة المدارس (مخصصة لمدير النظام Super Admin)
 */

/**
 * @swagger
 * /api/system/schools:
 *   get:
 *     summary: جلب جميع المدارس (Get all schools)
 *     tags: [System Admin - Schools (إدارة النظام - المدارس)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة المدارس
 *       403:
 *         description: غير مصرح
 *   post:
 *     summary: إضافة مدرسة جديدة (Create school)
 *     tags: [System Admin - Schools (إدارة النظام - المدارس)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameAr
 *               - nameEn
 *             properties:
 *               nameAr:
 *                 type: string
 *                 example: مدرسة الأمل
 *               nameEn:
 *                 type: string
 *                 example: Al Amal School
 *               address:
 *                 type: string
 *                 example: بغداد - الكرادة
 *               phone:
 *                 type: string
 *                 example: 07700000000
 *     responses:
 *       201:
 *         description: تم إضافة المدرسة بنجاح
 *       400:
 *         description: خطأ في إدخال البيانات
 */

/**
 * @swagger
 * /api/system/schools/{id}:
 *   get:
 *     summary: جلب تفاصيل مدرسة (Get school by ID)
 *     tags: [System Admin - Schools (إدارة النظام - المدارس)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المدرسة (ID)
 *     responses:
 *       200:
 *         description: تفاصيل المدرسة
 *       404:
 *         description: المدرسة غير موجودة
 *   put:
 *     summary: تعديل مدرسة (Update school)
 *     tags: [System Admin - Schools (إدارة النظام - المدارس)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المدرسة (ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameAr:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تعديل المدرسة بنجاح
 *       404:
 *         description: المدرسة غير موجودة
 *   delete:
 *     summary: حذف مدرسة (Delete school)
 *     tags: [System Admin - Schools (إدارة النظام - المدارس)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المدرسة (ID)
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       404:
 *         description: المدرسة غير موجودة
 */
