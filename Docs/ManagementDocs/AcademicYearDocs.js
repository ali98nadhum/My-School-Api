/**
 * @swagger
 * /api/management/academic-years:
 *   get:
 *     summary: عرض جميع السنوات الدراسية (Get all academic years)
 *     operationId: getAcademicYears
 *     tags: [🏫 الإدارة - السنوات الدراسية]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة السنوات الدراسية
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYearsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إضافة سنة دراسية جديدة (Add Academic Year)
 *     operationId: createAcademicYear
 *     tags: [🏫 الإدارة - السنوات الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAcademicYearRequest'
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYearResponse'
 *       400:
 *         description: خطأ في البيانات (مثل الاسم مكرر، أو تاريخ البداية بعد تاريخ النهاية)
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
 */

/**
 * @swagger
 * /api/management/academic-years/{id}:
 *   put:
 *     summary: تعديل بيانات سنة دراسية (Update Academic Year)
 *     operationId: updateAcademicYear
 *     tags: [🏫 الإدارة - السنوات الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAcademicYearRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYearResponse'
 *       400:
 *         description: خطأ في البيانات (مثل الاسم مكرر، أو تاريخ البداية بعد تاريخ النهاية)
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
 *   delete:
 *     summary: حذف سنة دراسية (Delete Academic Year)
 *     operationId: deleteAcademicYear
 *     tags: [🏫 الإدارة - السنوات الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لارتباطها بصفوف أو تسجيلات طلاب
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

/**
 * @swagger
 * /api/management/academic-years/{id}/set-current:
 *   patch:
 *     summary: تعيين السنة كـ "السنة الحالية" (Set Current Academic Year)
 *     operationId: setCurrentAcademicYear
 *     tags: [🏫 الإدارة - السنوات الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearIdParam'
 *     responses:
 *       200:
 *         description: تم التعيين بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYearResponse'
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
