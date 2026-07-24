/**
 * @swagger
 * /api/management/parents:
 *   get:
 *     summary: عرض جميع أولياء الأمور في المدرسة مع الفلاتر والترقيم
 *     operationId: getParents
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: بحث عن طريق الاسم، الإيميل، الهاتف، أو الرقم الوطني
 *       - in: query
 *         name: occupation
 *         required: false
 *         schema:
 *           type: string
 *         description: تصفية حسب المهنة
 *       - in: query
 *         name: isActive
 *         required: false
 *         schema:
 *           type: boolean
 *         description: تصفية حسب حالة التفعيل للحساب
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: قائمة أولياء الأمور
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedParentsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إضافة ولي أمر جديد
 *     operationId: createParent
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateParentRequest'
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParentProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف الأساسي مسجل مسبقاً، أو الرقم الوطني مسجل لولي أمر آخر
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
 */

/**
 * @swagger
 * /api/management/parents/{id}:
 *   get:
 *     summary: عرض تفاصيل ولي أمر محدد
 *     operationId: getParentById
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ParentIdParam'
 *     responses:
 *       200:
 *         description: بيانات ولي الأمر مع الطلاب المرتبطين به
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParentResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: ولي الأمر غير موجود أو لا ينتمي لهذه المدرسة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: تعديل بيانات ولي الأمر وحسابه
 *     operationId: updateParent
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ParentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateParentRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParentProfileResponse'
 *       400:
 *         description: البريد الإلكتروني، رقم الهاتف، أو الرقم الوطني مستخدم من قبل حساب آخر
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
 *         description: ولي الأمر غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف ولي الأمر (لمدير المدرسة فقط)
 *     operationId: deleteParent
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ParentIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: منع الحذف لكونه الولي الوحيد لبعض الطلاب
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
 *         description: ولي الأمر غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/parents/{id}/students:
 *   post:
 *     summary: ربط طالب بولي الأمر (الحد الأقصى 4 أولياء أمور للطالب)
 *     operationId: linkStudent
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ParentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LinkStudentRequest'
 *     responses:
 *       201:
 *         description: تم الربط بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LinkStudentResponse'
 *       400:
 *         description: الطالب مرتبط بالفعل بولي الأمر، أو تجاوز الحد الأقصى لأولياء الأمور
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
 *         description: ولي الأمر أو الطالب غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/parents/{id}/students/{studentId}:
 *   delete:
 *     summary: إلغاء ارتباط ولي الأمر بالطالب (يجب بقاء ولي أمر واحد على الأقل للطالب)
 *     operationId: unlinkStudent
 *     tags: [👥 الإدارة - أولياء الأمور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ParentIdParam'
 *       - $ref: '#/components/parameters/ParentLinkedStudentIdParam'
 *     responses:
 *       200:
 *         description: تم فك الارتباط بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن فك الارتباط لكونه ولي الأمر الوحيد للطالب
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
 *         description: ولي الأمر غير موجود، أو لا يوجد ارتباط بين ولي الأمر والطالب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
