/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: حساب المستخدم (بدون كلمة المرور المشفرة - تُستثنى دائماً من الاستجابات)
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف المستخدم
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         email:
 *           type: string
 *           description: البريد الإلكتروني (فريد)
 *         phone:
 *           type: string
 *           nullable: true
 *           description: رقم الهاتف (فريد)
 *         isActive:
 *           type: boolean
 *           description: هل الحساب مفعل؟
 *         isEmailVerified:
 *           type: boolean
 *           description: هل تم تأكيد البريد الإلكتروني؟
 *         failedLoginAttempts:
 *           type: integer
 *           description: عدد محاولات الدخول الفاشلة المتتالية
 *         lockedUntil:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: وقت انتهاء قفل الحساب المؤقت (بعد تجاوز عدد محاولات الدخول المسموح بها)
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: وقت آخر تسجيل دخول
 *         schoolId:
 *           type: integer
 *           nullable: true
 *           description: معرف المدرسة التابع لها الحساب
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         school:
 *           type: object
 *           nullable: true
 *           description: ملخص المدرسة المرتبطة (يظهر في تفاصيل المستخدم فقط)
 *         student:
 *           type: object
 *           nullable: true
 *           description: الملف الشخصي كطالب إن وجد
 *         teacher:
 *           type: object
 *           nullable: true
 *           description: الملف الشخصي كمعلم إن وجد
 *         staffMember:
 *           type: object
 *           nullable: true
 *           description: الملف الشخصي كموظف إداري/محاسب/مدير مدرسة إن وجد
 *         parent:
 *           type: object
 *           nullable: true
 *           description: الملف الشخصي كولي أمر إن وجد
 *     StaffProfile:
 *       type: object
 *       description: الملف الشخصي المرتبط بحساب المستخدم (جدول StaffMember) - يُستخدم لمدير المدرسة أيضاً
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         employeeCode:
 *           type: string
 *           description: الرقم الوظيفي (يُولّد تلقائياً)
 *         firstNameAr:
 *           type: string
 *           nullable: true
 *         lastNameAr:
 *           type: string
 *           nullable: true
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *         position:
 *           type: string
 *           nullable: true
 *           description: المسمى الوظيفي
 *         hireDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreatePrincipalRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstNameAr
 *         - lastNameAr
 *       properties:
 *         email:
 *           type: string
 *           description: البريد الإلكتروني لحساب مدير المدرسة
 *         password:
 *           type: string
 *           description: كلمة المرور (6 أحرف على الأقل)
 *         schoolId:
 *           type: integer
 *           nullable: true
 *           description: معرف المدرسة التي سيديرها
 *         firstNameAr:
 *           type: string
 *           description: الاسم الأول بالعربية
 *         lastNameAr:
 *           type: string
 *           description: الاسم الأخير بالعربية
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *           description: رقم الهاتف (صيغة عراقية)
 *         isActive:
 *           type: boolean
 *           description: هل الحساب مفعل؟ (افتراضياً true)
 *         isEmailVerified:
 *           type: boolean
 *           nullable: true
 *     UpdatePrincipalRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           description: كلمة المرور الجديدة (6 أحرف على الأقل، اختياري)
 *         schoolId:
 *           type: integer
 *           nullable: true
 *         firstNameAr:
 *           type: string
 *           nullable: true
 *         lastNameAr:
 *           type: string
 *           nullable: true
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           nullable: true
 *         isEmailVerified:
 *           type: boolean
 *           nullable: true
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *     PrincipalResponse:
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
 *               $ref: '#/components/schemas/User'
 *             profile:
 *               $ref: '#/components/schemas/StaffProfile'
 *     PaginatedUsersResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *           description: عدد العناصر في هذه الصفحة
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
