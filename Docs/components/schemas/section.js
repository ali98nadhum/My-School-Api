/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         classId:
 *           type: integer
 *           description: معرف الصف الدراسي التابعة له
 *         name:
 *           type: string
 *           nullable: true
 *           description: اسم الشعبة (أ، ب، A، B)
 *         capacity:
 *           type: integer
 *           description: السعة القصوى للطلاب (افتراضياً 30)
 *         homeroomTeacherId:
 *           type: integer
 *           nullable: true
 *           description: معرف المعلم المرشد للشعبة
 *         schoolClass:
 *           type: object
 *           nullable: true
 *           description: الصف الدراسي التابعة له (مع المرحلة والسنة الدراسية)
 *         homeroomTeacher:
 *           type: object
 *           nullable: true
 *           description: بيانات المعلم المرشد للشعبة إن وجد
 *         students:
 *           type: array
 *           nullable: true
 *           description: الطلاب المسجلون في الشعبة (تظهر في تفاصيل الشعبة فقط)
 *           items:
 *             type: object
 *     CreateSectionRequest:
 *       type: object
 *       required:
 *         - classId
 *         - name
 *       properties:
 *         classId:
 *           type: integer
 *           example: 1
 *           description: معرف الصف التابعة له
 *         name:
 *           type: string
 *           example: "A"
 *           description: اسم الشعبة (أ، ب، A، B) - حرف إلى 10 أحرف
 *         capacity:
 *           type: integer
 *           example: 30
 *           description: السعة القصوى للطلاب (افتراضياً 30)
 *         homeroomTeacherId:
 *           type: integer
 *           example: 1
 *           description: (اختياري) معرف المعلم المرشد للشعبة
 *     UpdateSectionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         homeroomTeacherId:
 *           type: integer
 *           nullable: true
 *     SectionResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Section'
 *     SectionsResponse:
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
 *             $ref: '#/components/schemas/Section'
 */
