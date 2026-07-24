/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         employeeCode:
 *           type: string
 *           description: الرقم الوظيفي للمعلم (يُولّد تلقائياً)
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
 *         hireDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         qualification:
 *           type: string
 *           nullable: true
 *           description: المؤهل العلمي
 *         specialization:
 *           type: string
 *           nullable: true
 *           description: التخصص
 *         avatarUrl:
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
 *           description: بيانات حساب الدخول المرتبط (البريد، الهاتف، حالة التفعيل)
 *         sectionSubjectTeachers:
 *           type: array
 *           nullable: true
 *           description: تعيينات المعلم (المواد والشُعب) - تظهر في تفاصيل المعلم فقط
 *           items:
 *             type: object
 *         homeroomSections:
 *           type: array
 *           nullable: true
 *           description: الشُعب التي يكون فيها المعلم مرشداً - تظهر في تفاصيل المعلم فقط
 *           items:
 *             type: object
 *     CreateTeacherRequest:
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
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         qualification:
 *           type: string
 *           nullable: true
 *         specialization:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           description: افتراضياً true
 *     UpdateTeacherRequest:
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
 *         lastNameAr:
 *           type: string
 *         firstNameEn:
 *           type: string
 *           nullable: true
 *         lastNameEn:
 *           type: string
 *           nullable: true
 *         qualification:
 *           type: string
 *           nullable: true
 *         specialization:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *     AssignTeacherRequest:
 *       type: object
 *       required:
 *         - sectionId
 *         - subjectId
 *         - academicYearId
 *       properties:
 *         sectionId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         academicYearId:
 *           type: integer
 *     TeacherAssignment:
 *       type: object
 *       description: تعيين معلم لمادة في شعبة دراسية (SectionSubjectTeacher)
 *       properties:
 *         id:
 *           type: integer
 *         sectionId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         academicYearId:
 *           type: integer
 *     TeacherProfileResponse:
 *       type: object
 *       description: استجابة إنشاء/تعديل معلم (حساب المستخدم + الملف الشخصي)
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
 *               $ref: '#/components/schemas/Teacher'
 *     TeacherResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Teacher'
 *     PaginatedTeachersResponse:
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
 *             $ref: '#/components/schemas/Teacher'
 *     TeacherAssignmentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/TeacherAssignment'
 */
