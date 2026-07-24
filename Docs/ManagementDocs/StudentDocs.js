/**
 * @swagger
 * tags:
 *   name: 👥 الإدارة - الطلاب
 *   description: مسارات إدارة بيانات الطلاب في المدرسة
 */

/**
 * @swagger
 * /api/management/students:
 *   get:
 *     summary: عرض جميع الطلاب مع الفلاتر والترقيم
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: بحث عن طريق الاسم، الكود الطلابي، أو الرقم الوطني
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *         required: false
 *         description: تصفية حسب حالة التسجيل
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         required: false
 *         description: تصفية حسب الجنس
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *         required: false
 *         description: تصفية حسب الشعبة
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *     responses:
 *       200:
 *         description: قائمة الطلاب
 */

/**
 * @swagger
 * /api/management/students:
 *   post:
 *     summary: إضافة طالب جديد وربطه بأولياء الأمور
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstNameAr
 *               - lastNameAr
 *               - gender
 *               - parentIds
 *             properties:
 *               email:
 *                 type: string
 *                 description: اختياري. إذا تم تزويده سيتم إنشاء حساب دخول للطالب
 *               password:
 *                 type: string
 *               studentCode:
 *                 type: string
 *                 description: الكود المدرسي (اختياري - يتم توليده إن ترك فارغاً)
 *               firstNameAr:
 *                 type: string
 *               middleNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               firstNameEn:
 *                 type: string
 *               middleNameEn:
 *                 type: string
 *               lastNameEn:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nationalId:
 *                 type: string
 *               nationality:
 *                 type: string
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *               currentSectionId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *               bloodType:
 *                 type: string
 *               address:
 *                 type: string
 *               parentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: يجب تزويد معرف ولي أمر واحد على الأقل، و 4 كحد أقصى.
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *       400:
 *         description: خطأ في البيانات (مثل تكرار الرقم الوطني، عدم وجود الآباء المدخلين، تجاوز الحد الأقصى للآباء)
 */

/**
 * @swagger
 * /api/management/students/{id}:
 *   get:
 *     summary: عرض تفاصيل الطالب
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: بيانات الطالب والتفاصيل المرتبطة به (الآباء، الشعبة، إلخ)
 */

/**
 * @swagger
 * /api/management/students/{id}:
 *   put:
 *     summary: تحديث بيانات الطالب
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
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
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               currentSectionId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *               parentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: استبدال قائمة أولياء الأمور المرتبطين بالطالب (يجب أن يبقى 1 على الأقل)
 *     responses:
 *       200:
 *         description: تم التحديث بنجاح
 */

/**
 * @swagger
 * /api/management/students/{id}:
 *   delete:
 *     summary: حذف الطالب (لمدير المدرسة فقط)
 *     tags: [👥 الإدارة - الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لوجود فواتير مسجلة على الطالب
 */
