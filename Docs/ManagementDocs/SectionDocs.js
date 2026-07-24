/**
 * @swagger
 * /api/management/sections:
 *   get:
 *     summary: عرض جميع الشُعب الدراسية التابعة لمدرسة المستخدم
 *     operationId: getSections
 *     tags: [🏫 الإدارة - الشُعب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ClassIdFilterParam'
 *     responses:
 *       200:
 *         description: قائمة الشُعب الدراسية
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إنشاء شُعبة دراسية جديدة
 *     operationId: createSection
 *     tags: [🏫 الإدارة - الشُعب]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSectionRequest'
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       400:
 *         description: يوجد شعبة بنفس الاسم داخل هذا الصف مسبقاً
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الصف أو المعلم غير موجود في مدرسة المستخدم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/sections/{id}:
 *   get:
 *     summary: عرض تفاصيل شعبة محددة
 *     operationId: getSectionById
 *     tags: [🏫 الإدارة - الشُعب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SectionIdParam'
 *     responses:
 *       200:
 *         description: تفاصيل الشعبة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
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
 *   put:
 *     summary: تعديل شُعبة دراسية
 *     operationId: updateSection
 *     tags: [🏫 الإدارة - الشُعب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SectionIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSectionRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SectionResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
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
 *     summary: حذف شُعبة دراسية
 *     operationId: deleteSection
 *     tags: [🏫 الإدارة - الشُعب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SectionIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لوجود طلاب أو معلمين مرتبطين بها
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير المدرسة فقط)
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
