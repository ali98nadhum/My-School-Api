/**
 * @swagger
 * /api/management/fees/types:
 *   post:
 *     summary: إضافة نوع رسم جديد
 *     operationId: createFeeType
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeeTypeRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء نوع الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeTypeResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
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
 *   get:
 *     summary: عرض جميع أنواع الرسوم
 *     operationId: getFeeTypes
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة أنواع الرسوم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeTypesResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/fees/types/{id}:
 *   put:
 *     summary: تعديل نوع رسم
 *     operationId: updateFeeType
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FeeTypeIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeeTypeRequest'
 *     responses:
 *       200:
 *         description: تم تحديث نوع الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeTypeResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
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
 *         description: نوع الرسم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف نوع رسم
 *     operationId: deleteFeeType
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FeeTypeIdParam'
 *     responses:
 *       200:
 *         description: تم حذف نوع الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لارتباط نوع الرسم بهيكلية رسوم دراسية
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
 *         description: نوع الرسم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/fees/structure:
 *   post:
 *     summary: إنشاء هيكلية رسم جديدة
 *     operationId: createFeeStructure
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeeStructureRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء هيكل الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeStructureResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة، أو تمت إضافة هذا الرسم مسبقاً لنفس الصف في نفس السنة الدراسية
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
 *         description: الصف الدراسي أو السنة الدراسية أو نوع الرسم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: عرض جميع هيكليات الرسوم
 *     operationId: getFeeStructures
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearIdFilterParam'
 *       - $ref: '#/components/parameters/GradeLevelIdFilterParam'
 *     responses:
 *       200:
 *         description: قائمة هيكليات الرسوم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeStructuresResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/fees/structure/{id}:
 *   put:
 *     summary: تعديل هيكلية رسم (المبلغ)
 *     operationId: updateFeeStructure
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FeeStructureIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeeStructureRequest'
 *     responses:
 *       200:
 *         description: تم تحديث هيكلية الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeeStructureResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
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
 *         description: هيكلية الرسم غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف هيكلية رسم
 *     operationId: deleteFeeStructure
 *     tags: [🏫 الإدارة - الرسوم الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FeeStructureIdParam'
 *     responses:
 *       200:
 *         description: تم حذف هيكلية الرسم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: هيكلية الرسم غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
