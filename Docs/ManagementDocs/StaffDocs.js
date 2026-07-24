/**
 * @swagger
 * /api/management/staff:
 *   get:
 *     summary: عرض جميع الموظفين (Get all staff)
 *     operationId: getStaff
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: البحث بالاسم أو البريد
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [TEACHER, ADMINISTRATOR, ACCOUNTANT]
 *         description: فلترة حسب الدور
 *     responses:
 *       200:
 *         description: قائمة الموظفين
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedStaffResponse'
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
 * /api/management/staff/admin:
 *   post:
 *     summary: إضافة موظف إداري جديد (Add Administrator)
 *     operationId: addAdministrator
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdministratorRequest'
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً، أو المستخدم الحالي غير مرتبط بمدرسة
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
 * /api/management/staff/accountant:
 *   post:
 *     summary: إضافة محاسب جديد (Add Accountant)
 *     operationId: addAccountant
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountantRequest'
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً، أو المستخدم الحالي غير مرتبط بمدرسة
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
 * /api/management/staff/teacher:
 *   post:
 *     summary: إضافة معلم جديد (Add Teacher)
 *     operationId: addTeacher
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffTeacherRequest'
 *     responses:
 *       201:
 *         description: تم الإضافة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً، أو المستخدم الحالي غير مرتبط بمدرسة
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
 * /api/management/staff/{id}:
 *   put:
 *     summary: تعديل بيانات موظف (Update Staff)
 *     operationId: updateStaff
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StaffIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStaffRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffProfileResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مستخدم لحساب آخر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لا تملك صلاحية لتعديل بيانات هذا الحساب)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الموظف غير موجود أو لا تملك صلاحية الوصول إليه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف موظف (Delete Staff)
 *     operationId: deleteStaff
 *     tags: [👥 الإدارة - الموظفين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StaffIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكنك حذف حسابك الخاص
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح، أو محاولة حذف مدير المدرسة من هذه الواجهة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الموظف غير موجود أو لا تملك صلاحية حذفه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
