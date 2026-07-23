/**
 * @swagger
 * tags:
 *   name: Management - Teachers (إدارة المدرسة - المعلمين)
 *   description: مسارات إدارة المعلمين وتعييناتهم (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/teachers:
 *   get:
 *     summary: عرض جميع المعلمين في المدرسة مع الفلاتر والترقيم
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: بحث عن طريق الاسم، الإيميل، الهاتف، أو الرقم الوظيفي
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         required: false
 *         description: تصفية المعلمين حسب التخصص
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: تصفية حسب حالة التفعيل للحساب
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: رقم الصفحة
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: عدد العناصر في الصفحة الواحدة
 *     responses:
 *       200:
 *         description: قائمة المعلمين مع بيانات الترقيم
 */

/**
 * @swagger
 * /api/management/teachers:
 *   post:
 *     summary: إضافة معلم جديد للمدرسة (إنشاء حساب + ملف المعلم)
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstNameAr
 *               - lastNameAr
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               firstNameEn:
 *                 type: string
 *               lastNameEn:
 *                 type: string
 *               qualification:
 *                 type: string
 *               specialization:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: تم إنشاء المعلم بنجاح
 *       400:
 *         description: الإيميل أو الهاتف مسجل مسبقاً
 */

/**
 * @swagger
 * /api/management/teachers/{id}:
 *   get:
 *     summary: عرض تفاصيل معلم محدد شاملة المواد والشعب المعين لها
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المعلم
 *     responses:
 *       200:
 *         description: تفاصيل المعلم
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/teachers/{id}:
 *   put:
 *     summary: تعديل بيانات المعلم وحسابه
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المعلم
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               firstNameEn:
 *                 type: string
 *               lastNameEn:
 *                 type: string
 *               qualification:
 *                 type: string
 *               specialization:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 */

/**
 * @swagger
 * /api/management/teachers/{id}/assignments:
 *   post:
 *     summary: تعيين المعلم لتدريس مادة معينة في شعبة دراسية
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المعلم
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sectionId
 *               - subjectId
 *               - academicYearId
 *             properties:
 *               sectionId:
 *                 type: integer
 *               subjectId:
 *                 type: integer
 *               academicYearId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: تم التعيين بنجاح
 *       400:
 *         description: المعلم معين بالفعل لنفس الشعبة والمادة
 */

/**
 * @swagger
 * /api/management/teachers/{id}:
 *   delete:
 *     summary: حذف المعلم (لمدير المدرسة فقط)
 *     tags: [Management - Teachers (إدارة المدرسة - المعلمين)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المعلم
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لوجود شعب أو جداول دراسية مرتبطة بالمعلم (تم منع الـ 500)
 *       403:
 *         description: غير مصرح (للمدير فقط)
 */
