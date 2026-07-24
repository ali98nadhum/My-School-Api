/**
 * @swagger
 * tags:
 *   name: 🛡️ النظام - المصادقة
 *   description: مسارات تسجيل الدخول وإدارة الجلسات
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: تسجيل الدخول (Login)
 *     tags: [🛡️ النظام - المصادقة]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@school.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: تم تسجيل الدخول بنجاح
 *       401:
 *         description: بيانات الدخول غير صحيحة
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: تحديث التوكن (Refresh Token)
 *     tags: [🛡️ النظام - المصادقة]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم إصدار توكن جديد بنجاح
 *       401:
 *         description: التوكن غير صالح أو منتهي
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: تسجيل الخروج (Logout)
 *     tags: [🛡️ النظام - المصادقة]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تسجيل الخروج بنجاح
 *       401:
 *         description: غير مصرح
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: تغيير كلمة المرور (Change Password)
 *     tags: [🛡️ النظام - المصادقة]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تغيير كلمة المرور بنجاح
 *       400:
 *         description: كلمة المرور القديمة غير صحيحة
 */
