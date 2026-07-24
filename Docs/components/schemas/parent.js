/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
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
 *         nationalId:
 *           type: string
 *           nullable: true
 *         occupation:
 *           type: string
 *           nullable: true
 *         phonePrimary:
 *           type: string
 *           nullable: true
 *         phoneSecondary:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           nullable: true
 *           description: بيانات حساب الدخول المرتبط (البريد، حالة التفعيل، تاريخ الإنشاء) - تظهر في تفاصيل ولي الأمر فقط
 *         studentGuardians:
 *           type: array
 *           nullable: true
 *           description: روابط الطلاب المرتبطين بولي الأمر - تظهر في تفاصيل ولي الأمر فقط
 *           items:
 *             type: object
 *     CreateParentRequest:
 *       type: object
 *       required:
 *         - password
 *         - phonePrimary
 *         - firstNameAr
 *         - lastNameAr
 *       properties:
 *         email:
 *           type: string
 *           nullable: true
 *           description: "اختياري - إذا لم يُرسل يُولّد بريد تلقائي من رقم الهاتف"
 *         password:
 *           type: string
 *           description: كلمة المرور (6 أحرف على الأقل)
 *         phonePrimary:
 *           type: string
 *           description: رقم الهاتف الأساسي (صيغة عراقية، مطلوب)
 *         phoneSecondary:
 *           type: string
 *           nullable: true
 *           description: رقم هاتف بديل (صيغة عراقية)
 *         firstNameAr:
 *           type: string
 *         lastNameAr:
 *           type: string
 *           description: الاسم الثاني لولي الأمر
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         nationalId:
 *           type: string
 *           nullable: true
 *         occupation:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           description: افتراضياً true
 *     UpdateParentRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phonePrimary:
 *           type: string
 *           nullable: true
 *         phoneSecondary:
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
 *         nationalId:
 *           type: string
 *           nullable: true
 *         occupation:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *     LinkStudentRequest:
 *       type: object
 *       required:
 *         - studentId
 *       properties:
 *         studentId:
 *           type: integer
 *         relationshipType:
 *           $ref: '#/components/schemas/GuardianRelationship'
 *         isPrimaryContact:
 *           type: boolean
 *           default: true
 *         canPickup:
 *           type: boolean
 *           default: true
 *         financialResponsible:
 *           type: boolean
 *           default: true
 *     StudentGuardianLink:
 *       type: object
 *       description: رابط الربط بين ولي الأمر والطالب (StudentGuardian)
 *       properties:
 *         id:
 *           type: integer
 *         studentId:
 *           type: integer
 *         parentId:
 *           type: integer
 *         relationshipType:
 *           $ref: '#/components/schemas/GuardianRelationship'
 *         isPrimaryContact:
 *           type: boolean
 *         canPickup:
 *           type: boolean
 *         financialResponsible:
 *           type: boolean
 *     ParentProfileResponse:
 *       type: object
 *       description: استجابة إنشاء/تعديل ولي أمر (حساب المستخدم + الملف الشخصي)
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
 *               $ref: '#/components/schemas/Parent'
 *     ParentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Parent'
 *     PaginatedParentsResponse:
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
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parent'
 *     LinkStudentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/StudentGuardianLink'
 */
