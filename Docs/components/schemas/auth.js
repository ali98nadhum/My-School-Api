/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: admin@school.com
 *           description: البريد الإلكتروني
 *         password:
 *           type: string
 *           example: password123
 *           description: كلمة المرور
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               description: بيانات مختصرة عن المستخدم المسجل دخوله
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   $ref: '#/components/schemas/UserRole'
 *                 schoolId:
 *                   type: integer
 *                   nullable: true
 *             token:
 *               type: string
 *               description: توكن الوصول (JWT)
 *             refreshToken:
 *               type: string
 *               description: توكن التجديد
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: توكن التجديد الصادر عند تسجيل الدخول
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: توكن وصول جديد (JWT)
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: كلمة المرور الحالية
 *         newPassword:
 *           type: string
 *           description: كلمة المرور الجديدة
 *     MessageResponse:
 *       type: object
 *       description: استجابة نجاح عامة برسالة فقط بدون بيانات
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 */
