/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *           nullable: true
 *           description: قد يكون فارغاً إذا لم يُعطَ الطالب حساب دخول
 *         studentCode:
 *           type: string
 *           description: الرقم المدرسي (فريد)
 *         qrCode:
 *           type: string
 *           description: كود البطاقة المدرسية
 *         firstNameAr:
 *           type: string
 *           nullable: true
 *         middleNameAr:
 *           type: string
 *           nullable: true
 *         lastNameAr:
 *           type: string
 *           nullable: true
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         middleNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *         nationalId:
 *           type: string
 *           nullable: true
 *         nationality:
 *           type: string
 *           nullable: true
 *         enrollmentDate:
 *           type: string
 *           format: date
 *         currentSectionId:
 *           type: integer
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *         bloodType:
 *           type: string
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         schoolId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         currentSection:
 *           type: object
 *           nullable: true
 *           description: الشعبة الحالية للطالب (مع الصف الدراسي)
 *         studentGuardians:
 *           type: array
 *           nullable: true
 *           description: أولياء الأمور المرتبطون بالطالب
 *           items:
 *             type: object
 *         user:
 *           type: object
 *           nullable: true
 *           description: بيانات حساب الدخول المرتبط (تظهر في تفاصيل الطالب فقط)
 *     CreateStudentRequest:
 *       type: object
 *       required:
 *         - firstNameAr
 *         - lastNameAr
 *         - gender
 *         - parentIds
 *       properties:
 *         email:
 *           type: string
 *           nullable: true
 *           description: اختياري. إذا تم تزويده سيتم إنشاء حساب دخول للطالب
 *         password:
 *           type: string
 *           nullable: true
 *           description: 6 أحرف على الأقل (مطلوب فقط إذا أُرسل email)
 *         studentCode:
 *           type: string
 *           nullable: true
 *           description: الكود المدرسي (اختياري - يتم توليده تلقائياً إن ترك فارغاً)
 *         firstNameAr:
 *           type: string
 *         middleNameAr:
 *           type: string
 *           nullable: true
 *         lastNameAr:
 *           type: string
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         middleNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *         nationalId:
 *           type: string
 *           nullable: true
 *         nationality:
 *           type: string
 *           nullable: true
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         currentSectionId:
 *           type: integer
 *           nullable: true
 *         status:
 *           allOf:
 *             - $ref: '#/components/schemas/EnrollmentStatus'
 *           default: ACTIVE
 *         bloodType:
 *           type: string
 *           nullable: true
 *           maxLength: 5
 *         address:
 *           type: string
 *           nullable: true
 *         parentIds:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           maxItems: 4
 *           description: يجب تزويد معرف ولي أمر واحد على الأقل، و4 كحد أقصى
 *     UpdateStudentRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           nullable: true
 *         password:
 *           type: string
 *           nullable: true
 *         studentCode:
 *           type: string
 *         firstNameAr:
 *           type: string
 *         middleNameAr:
 *           type: string
 *           nullable: true
 *         lastNameAr:
 *           type: string
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         middleNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *         nationalId:
 *           type: string
 *           nullable: true
 *         nationality:
 *           type: string
 *           nullable: true
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         currentSectionId:
 *           type: integer
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *         bloodType:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         parentIds:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           maxItems: 4
 *           description: استبدال قائمة أولياء الأمور المرتبطين بالطالب (يجب أن يبقى 1 على الأقل)
 *     CreateStudentResponse:
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
 *             student:
 *               $ref: '#/components/schemas/Student'
 *             user:
 *               type: object
 *               nullable: true
 *               description: حساب الدخول المُنشأ (فقط إذا تم إرسال email/password)
 *             parentIds:
 *               type: array
 *               items:
 *                 type: integer
 *     StudentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Student'
 *     PaginatedStudentsResponse:
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
 *             $ref: '#/components/schemas/Student'
 */
