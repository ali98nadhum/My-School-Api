/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolClass:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         gradeLevelId:
 *           type: integer
 *         academicYearId:
 *           type: integer
 *         nameEn:
 *           type: string
 *           nullable: true
 *         nameAr:
 *           type: string
 *           nullable: true
 *         gradeLevel:
 *           $ref: '#/components/schemas/GradeLevel'
 *         academicYear:
 *           type: object
 *           nullable: true
 *           description: السنة الدراسية المرتبطة (تظهر في القوائم والتفاصيل)
 *         sections:
 *           type: array
 *           nullable: true
 *           description: الشُعب التابعة لهذا الصف (تظهر في تفاصيل الصف فقط)
 *           items:
 *             type: object
 *     CreateSchoolClassRequest:
 *       type: object
 *       required:
 *         - gradeLevelId
 *         - academicYearId
 *       properties:
 *         gradeLevelId:
 *           type: integer
 *           example: 1
 *           description: معرف المرحلة الدراسية (Global Grade Level)
 *         academicYearId:
 *           type: integer
 *           example: 1
 *           description: معرف السنة الدراسية (المرتبطة بمدرسة المستخدم)
 *         nameEn:
 *           type: string
 *           example: "First Grade"
 *           description: (اختياري) يُؤخذ اسم المرحلة إن لم يُحدد
 *         nameAr:
 *           type: string
 *           example: "الأول الابتدائي المميز"
 *           description: (اختياري) يُؤخذ اسم المرحلة إن لم يُحدد
 *     UpdateSchoolClassRequest:
 *       type: object
 *       properties:
 *         nameEn:
 *           type: string
 *         nameAr:
 *           type: string
 *     SchoolClassResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/SchoolClass'
 *     SchoolClassesResponse:
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
 *             $ref: '#/components/schemas/SchoolClass'
 */
