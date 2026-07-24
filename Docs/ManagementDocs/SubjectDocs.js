/**
 * @swagger
 * tags:
 *   name: 🏫 الإدارة - المواد الدراسية
 *   description: مسارات إدارة المواد الدراسية (مخصصة لمدير المدرسة والإدارة)
 */

/**
 * @swagger
 * /api/management/subjects:
 *   get:
 *     summary: عرض جميع المواد الدراسية المسجلة في النظام
 *     tags: [🏫 الإدارة - المواد الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: تصفية حسب حالة التفعيل (true/false)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: بحث عن طريق اسم المادة (عربي/إنجليزي) أو الرمز
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         required: false
 *         description: تصفية لجلب المواد التي يتم تدريسها لصف دراسي معين
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
 *         description: قائمة المواد الدراسية
 *       403:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/management/subjects:
 *   post:
 *     summary: إضافة مادة دراسية جديدة للمنهاج العام
 *     tags: [🏫 الإدارة - المواد الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "PHY101"
 *                 description: رمز المادة المميز (فريد ولا يمكن تكراره)
 *               nameEn:
 *                 type: string
 *                 example: "Physics"
 *                 description: اسم المادة بالإنجليزية (مطلوب هو أو الاسم بالعربي)
 *               nameAr:
 *                 type: string
 *                 example: "الفيزياء"
 *                 description: اسم المادة بالعربية (مطلوب هو أو الاسم بالإنجليزي)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: هل المادة مفعلة للاستخدام؟
 *     responses:
 *       201:
 *         description: تم الإنشاء بنجاح
 *       400:
 *         description: رمز المادة مكرر أو البيانات غير مكتملة
 */

/**
 * @swagger
 * /api/management/subjects/{id}:
 *   get:
 *     summary: عرض تفاصيل مادة محددة
 *     tags: [🏫 الإدارة - المواد الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المادة
 *     responses:
 *       200:
 *         description: تفاصيل المادة
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/subjects/{id}:
 *   put:
 *     summary: تعديل مادة دراسية
 *     tags: [🏫 الإدارة - المواد الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المادة
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               nameAr:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: تم التعديل بنجاح
 *       400:
 *         description: رمز المادة مكرر
 *       404:
 *         description: غير موجود
 */

/**
 * @swagger
 * /api/management/subjects/{id}:
 *   delete:
 *     summary: حذف مادة دراسية
 *     tags: [🏫 الإدارة - المواد الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: معرف المادة
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *       400:
 *         description: لا يمكن الحذف لارتباط المادة بجداول، شُعب، معلمين، واجبات أو امتحانات (مهم لمنع خطأ 500)
 *       403:
 *         description: غير مصرح (لمدير المدرسة فقط)
 *       404:
 *         description: غير موجود
 */
