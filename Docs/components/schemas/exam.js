/**
 * @swagger
 * components:
 *   schemas:
 *     ExamType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف نوع الامتحان
 *         nameAr:
 *           type: string
 *           description: اسم نوع الامتحان بالعربية
 *         nameEn:
 *           type: string
 *           nullable: true
 *           description: اسم نوع الامتحان بالإنجليزية
 *         weightPercentage:
 *           type: number
 *           description: نسبة وزن هذا النوع من الدرجة النهائية
 *     CreateExamTypeRequest:
 *       type: object
 *       required:
 *         - nameAr
 *       properties:
 *         nameAr:
 *           type: string
 *           example: "امتحان نصف السنة"
 *           description: اسم نوع الامتحان بالعربية
 *         nameEn:
 *           type: string
 *           nullable: true
 *           description: اسم نوع الامتحان بالإنجليزية (اختياري)
 *         weightPercentage:
 *           type: number
 *           example: 30
 *           description: نسبة وزن هذا النوع من الدرجة النهائية (من 0 إلى 100، اختياري)
 *     UpdateExamTypeRequest:
 *       type: object
 *       properties:
 *         nameAr:
 *           type: string
 *         nameEn:
 *           type: string
 *           nullable: true
 *         weightPercentage:
 *           type: number
 *     ExamTypeResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/ExamType'
 *     ExamTypesResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExamType'
 *     Exam:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف الامتحان
 *         academicYearId:
 *           type: integer
 *         examTypeId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         sectionId:
 *           type: integer
 *         examDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: تاريخ الامتحان
 *         maxScore:
 *           type: number
 *           description: الدرجة العظمى للامتحان
 *         passingScore:
 *           type: number
 *           description: درجة النجاح في الامتحان
 *         createdBy:
 *           type: integer
 *           description: معرف المستخدم الذي أنشأ الامتحان
 *         createdAt:
 *           type: string
 *           format: date-time
 *         examType:
 *           type: object
 *           nullable: true
 *           description: تفاصيل نوع الامتحان (يظهر في قوائم الإدارة والمعلم)
 *         subject:
 *           type: object
 *           nullable: true
 *           description: ملخص المادة (يظهر في قوائم الإدارة والمعلم)
 *         section:
 *           type: object
 *           nullable: true
 *           description: ملخص الشعبة والصف الدراسي (يظهر في قوائم الإدارة والمعلم)
 *         createdByUser:
 *           type: object
 *           nullable: true
 *           description: ملخص بيانات منشئ الامتحان (يظهر في قائمة امتحانات الإدارة فقط)
 *     CreateExamRequest:
 *       type: object
 *       required:
 *         - academicYearId
 *         - examTypeId
 *         - subjectId
 *         - sectionId
 *       properties:
 *         academicYearId:
 *           type: integer
 *           description: معرف السنة الدراسية
 *         examTypeId:
 *           type: integer
 *           description: معرف نوع الامتحان
 *         subjectId:
 *           type: integer
 *           description: معرف المادة
 *         sectionId:
 *           type: integer
 *           description: معرف الشعبة
 *         examDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: تاريخ الامتحان (اختياري)
 *         maxScore:
 *           type: number
 *           example: 100
 *           description: الدرجة العظمى للامتحان (اختياري، الافتراضي 100)
 *         passingScore:
 *           type: number
 *           example: 50
 *           description: درجة النجاح في الامتحان (اختياري، الافتراضي 50)
 *     UpdateExamRequest:
 *       type: object
 *       properties:
 *         examDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         maxScore:
 *           type: number
 *         passingScore:
 *           type: number
 *     ExamResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Exam'
 *     ExamsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exam'
 */
