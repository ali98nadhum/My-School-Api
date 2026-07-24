/**
 * @swagger
 * /api/management/teachers:
 *   get:
 *     summary: عرض جميع المعلمين في المدرسة مع الفلاتر والترقيم
 *     operationId: getTeachers
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: بحث عن طريق الاسم، الإيميل، الهاتف، أو الرقم الوظيفي
 *       - in: query
 *         name: specialization
 *         required: false
 *         schema:
 *           type: string
 *         description: تصفية المعلمين حسب التخصص
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
 *         description: قائمة المعلمين مع بيانات الترقيم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTeachersResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إضافة معلم جديد للمدرسة (إنشاء حساب + ملف المعلم)
 *     operationId: createTeacher
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeacherRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء المعلم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherProfileResponse'
 *       400:
 *         description: الإيميل أو الهاتف مسجل مسبقاً
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
 * /api/management/teachers/{id}:
 *   get:
 *     summary: عرض تفاصيل معلم محدد شاملة المواد والشعب المعين لها
 *     operationId: getTeacherById
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherIdParam'
 *     responses:
 *       200:
 *         description: تفاصيل المعلم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherResponse'
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
 *     summary: تعديل بيانات المعلم وحسابه
 *     operationId: updateTeacher
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTeacherRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مستخدم لحساب آخر
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
 *         description: غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف المعلم (لمدير المدرسة فقط)
 *     operationId: deleteTeacher
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لوجود شعب أو جداول دراسية مرتبطة بالمعلم (تم منع الـ 500)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (للمدير فقط)
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
 * /api/management/teachers/{id}/assignments:
 *   post:
 *     summary: تعيين المعلم لتدريس مادة معينة في شعبة دراسية
 *     operationId: assignTeacher
 *     tags: [👥 الإدارة - المعلمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTeacherRequest'
 *     responses:
 *       201:
 *         description: تم التعيين بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeacherAssignmentResponse'
 *       400:
 *         description: المعلم معين بالفعل لنفس الشعبة والمادة والسنة الدراسية
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
 *         description: المعلم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
