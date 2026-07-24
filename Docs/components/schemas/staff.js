/**
 * @swagger
 * components:
 *   schemas:
 *     StaffListItem:
 *       type: object
 *       description: عنصر في قائمة الموظفين (بيانات المستخدم مدموجة مع ملفه الشخصي)
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             profile:
 *               type: object
 *               nullable: true
 *               description: الملف الشخصي (StaffProfile للإداري/المحاسب، أو Teacher للمعلم)
 *     CreateAdministratorRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstNameAr
 *         - lastNameAr
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           description: كلمة المرور (6 أحرف على الأقل)
 *         phone:
 *           type: string
 *           nullable: true
 *         firstNameAr:
 *           type: string
 *         lastNameAr:
 *           type: string
 *     CreateAccountantRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstNameAr
 *         - lastNameAr
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           description: كلمة المرور (6 أحرف على الأقل)
 *         phone:
 *           type: string
 *           nullable: true
 *         firstNameAr:
 *           type: string
 *         lastNameAr:
 *           type: string
 *     CreateStaffTeacherRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstNameAr
 *         - lastNameAr
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           description: كلمة المرور (6 أحرف على الأقل)
 *         phone:
 *           type: string
 *           nullable: true
 *         firstNameAr:
 *           type: string
 *         lastNameAr:
 *           type: string
 *         specialization:
 *           type: string
 *           nullable: true
 *     UpdateStaffRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
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
 *         qualification:
 *           type: string
 *           nullable: true
 *           description: يُحدّث فقط إذا كان الموظف معلماً
 *         specialization:
 *           type: string
 *           nullable: true
 *           description: يُحدّث فقط إذا كان الموظف معلماً
 *         isActive:
 *           type: boolean
 *           nullable: true
 *         isEmailVerified:
 *           type: boolean
 *           nullable: true
 *     StaffProfileResponse:
 *       type: object
 *       description: استجابة إنشاء/تعديل موظف (حساب المستخدم + الملف الشخصي)
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
 *               type: object
 *               nullable: true
 *               description: StaffProfile للإداري/المحاسب، أو Teacher للمعلم
 *     PaginatedStaffResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *         data:
 *           type: object
 *           properties:
 *             staff:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffListItem'
 */
