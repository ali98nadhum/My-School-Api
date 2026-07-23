/**
 * @swagger
 * tags:
 *   name: Management - Parents (إدارة المدرسة - أولياء الأمور)
 *   description: مسارات إدارة أولياء الأمور وربطهم بالطلاب
 */

/**
 * @swagger
 * /api/management/parents:
 *   get:
 *     summary: عرض جميع أولياء الأمور في المدرسة مع الفلاتر والترقيم
 *     tags: [Management - Parents (إدارة المدرسة - أولياء الأمور)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: بحث عن طريق الاسم، الإيميل، الهاتف، أو الرقم الوطني
 *       - in: query
 *         name: occupation
 *         schema:
 *           type: string
 *         required: false
 *         description: تصفية حسب المهنة
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *     responses:
 *       200:
 *         description: قائمة أولياء الأمور
 */

/**
 * @swagger
 * /api/management/parents:
 *   post:
 *     summary: إضافة ولي أمر جديد
 *     tags: [Management - Parents (إدارة المدرسة - أولياء الأمور)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - phonePrimary
 *               - firstNameAr
 *               - lastNameAr
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phonePrimary:
 *                 type: string
 *               phoneSecondary:
 *                 type: string
 *               firstNameAr:
 *                 type: string
 *               lastNameAr:
 *                 type: string
 *                 description: الاسم الثاني لولي الأمر
 *               firstNameEn:
 *                 type: string
 *               lastNameEn:
 *                 type: string
 *               nationalId:
 *                 type: string
 *               occupation:
 *                 type: string
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 */

/**
 * @swagger
 * /api/management/parents/{id}/students:
 *   post:
 *     summary: ربط طالب بولي الأمر (الحد الأقصى 4 أولياء أمور للطالب)
 *     tags: [Management - Parents (إدارة المدرسة - أولياء الأمور)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف ولي الأمر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: integer
 *               relationshipType:
 *                 type: string
 *                 enum: [FATHER, MOTHER, GRANDFATHER, GRANDMOTHER, UNCLE, AUNT, BROTHER, SISTER, OTHER]
 *               isPrimaryContact:
 *                 type: boolean
 *                 default: true
 *               canPickup:
 *                 type: boolean
 *                 default: true
 *               financialResponsible:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: تم الربط بنجاح
 *       400:
 *         description: تجاوز الحد الأقصى لأولياء الأمور
 */

/**
 * @swagger
 * /api/management/parents/{id}/students/{studentId}:
 *   delete:
 *     summary: إلغاء ارتباط ولي الأمر بالطالب (يجب بقاء ولي أمر واحد على الأقل للطالب)
 *     tags: [Management - Parents (إدارة المدرسة - أولياء الأمور)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: تم فك الارتباط بنجاح
 *       400:
 *         description: لا يمكن فك الارتباط لكونه ولي الأمر الوحيد للطالب
 */

/**
 * @swagger
 * /api/management/parents/{id}:
 *   delete:
 *     summary: حذف ولي الأمر (لمدير المدرسة فقط)
 *     tags: [Management - Parents (إدارة المدرسة - أولياء الأمور)]
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
 *         description: منع الحذف لكونه الولي الوحيد لبعض الطلاب
 */
