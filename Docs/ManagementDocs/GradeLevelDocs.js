/**
 * @swagger
 * /api/system/grade-levels:
 *   get:
 *     summary: عرض جميع المراحل الدراسية
 *     operationId: getGradeLevels
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة المراحل الدراسية
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeLevelsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إضافة مرحلة دراسية جديدة
 *     operationId: createGradeLevel
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGradeLevelRequest'
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeLevelResponse'
 *       400:
 *         description: بيانات خاطئة أو الترتيب مكرر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير النظام Super Admin فقط)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/system/grade-levels/{id}:
 *   get:
 *     summary: عرض تفاصيل مرحلة دراسية محددة
 *     operationId: getGradeLevelById
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GradeLevelIdParam'
 *     responses:
 *       200:
 *         description: تفاصيل المرحلة الدراسية
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeLevelResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: المرحلة الدراسية غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: تعديل مرحلة دراسية
 *     operationId: updateGradeLevel
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GradeLevelIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGradeLevelRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeLevelResponse'
 *       400:
 *         description: يوجد مرحلة دراسية أخرى تستخدم نفس هذا الترتيب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير النظام Super Admin فقط)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف مرحلة دراسية
 *     operationId: deleteGradeLevel
 *     tags: [🏫 الإدارة - المراحل الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GradeLevelIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لوجود ارتباطات (صفوف أو هياكل رسوم)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير النظام Super Admin فقط)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
