/**
 * @swagger
 * /api/management/students:
 *   get:
 *     summary: عرض جميع الطلاب مع الفلاتر والترقيم
 *     operationId: getStudents
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: بحث عن طريق الاسم، الكود الطلابي، أو الرقم الوطني
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *         description: تصفية حسب حالة التسجيل
 *       - in: query
 *         name: gender
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/Gender'
 *         description: تصفية حسب الجنس
 *       - $ref: '#/components/parameters/SectionIdFilterParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: قائمة الطلاب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedStudentsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: إضافة طالب جديد وربطه بأولياء الأمور
 *     operationId: createStudent
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateStudentResponse'
 *       400:
 *         description: خطأ في البيانات (مثل تكرار الرقم الوطني، عدم وجود الآباء المدخلين، تجاوز الحد الأقصى للآباء)
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
 * /api/management/students/{id}:
 *   get:
 *     summary: عرض تفاصيل الطالب
 *     operationId: getStudentById
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StudentIdParam'
 *     responses:
 *       200:
 *         description: بيانات الطالب والتفاصيل المرتبطة به (الآباء، الشعبة، إلخ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الطالب غير موجود أو لا ينتمي لهذه المدرسة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: تحديث بيانات الطالب
 *     operationId: updateStudent
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StudentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudentRequest'
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: خطأ في البيانات (مثل تكرار البريد الإلكتروني أو الرقم الوطني أو الكود المدرسي)
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
 *         description: الطالب غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف الطالب (لمدير المدرسة فقط)
 *     operationId: deleteStudent
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/StudentIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: لا يمكن الحذف لوجود فواتير مسجلة على الطالب
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
 *         description: الطالب غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
