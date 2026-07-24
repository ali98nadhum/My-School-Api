/**
 * @swagger
 * /api/system/users:
 *   get:
 *     summary: جلب جميع المستخدمين (Get all users)
 *     operationId: getUsers
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SearchParam'
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/UserRole'
 *         description: تصفية حسب صلاحية المستخدم
 *       - in: query
 *         name: schoolId
 *         required: false
 *         schema:
 *           type: integer
 *         description: تصفية حسب معرف المدرسة
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: قائمة المستخدمين
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsersResponse'
 *       400:
 *         description: قيمة الصلاحية (role) غير صالحة للبحث
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
 * /api/system/users/principal:
 *   post:
 *     summary: إضافة مدير مدرسة جديد (Create Principal)
 *     operationId: createPrincipal
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePrincipalRequest'
 *     responses:
 *       201:
 *         description: تم إضافة مدير المدرسة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrincipalResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً، أو خطأ في إدخال البيانات
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
 * /api/system/users/{id}:
 *   get:
 *     summary: جلب مستخدم بواسطة المعرف (Get user by ID)
 *     operationId: getUserById
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         description: تفاصيل المستخدم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير النظام Super Admin فقط)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/system/users/principal/{id}:
 *   put:
 *     summary: تعديل بيانات مدير مدرسة (Update Principal)
 *     operationId: updatePrincipal
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePrincipalRequest'
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrincipalResponse'
 *       400:
 *         description: البريد الإلكتروني أو رقم الهاتف مستخدم من قبل حساب آخر
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
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف مدير مدرسة (Delete Principal)
 *     operationId: deletePrincipal
 *     tags: [🛡️ النظام - المستخدمين]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       204:
 *         description: تم الحذف بنجاح (بدون محتوى في الاستجابة)
 *       400:
 *         description: لا يمكنك حذف حسابك الخاص
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
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
