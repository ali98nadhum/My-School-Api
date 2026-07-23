/**
 * @swagger
 * tags:
 *   name: Management - Academic Year (إدارة المدرسة - السنوات الدراسية)
 *   description: مسارات إدارة السنوات الدراسية للمدرسة (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/academic-years:
 *   get:
 *     summary: عرض جميع السنوات الدراسية (Get all academic years)
 *     tags: [Management - Academic Year (إدارة المدرسة - السنوات الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة السنوات الدراسية
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/academic-years:
 *   post:
 *     summary: إضافة سنة دراسية جديدة (Add Academic Year)
 *     tags: [Management - Academic Year (إدارة المدرسة - السنوات الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "2025/2026"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               isCurrent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *       400:
 *         description: خطأ في البيانات (مثل الاسم مكرر)
 */

/**
 * @swagger
 * /api/management/academic-years/{id}:
 *   put:
 *     summary: تعديل بيانات سنة دراسية (Update Academic Year)
 *     tags: [Management - Academic Year (إدارة المدرسة - السنوات الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف السنة الدراسية
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "2025/2026"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               isCurrent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/academic-years/{id}:
 *   delete:
 *     summary: حذف سنة دراسية (Delete Academic Year)
 *     tags: [Management - Academic Year (إدارة المدرسة - السنوات الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف السنة الدراسية
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لارتباطها ببيانات أخرى
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/academic-years/{id}/set-current:
 *   patch:
 *     summary: تعيين السنة كـ "السنة الحالية" (Set Current Academic Year)
 *     tags: [Management - Academic Year (إدارة المدرسة - السنوات الدراسية)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف السنة الدراسية
 *     responses:
 *       200:
 *         description: تم التعيين بنجاح
 *       404:
 *         description: غير موجود
 */
