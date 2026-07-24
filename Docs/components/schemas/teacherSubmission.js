/**
 * @swagger
 * components:
 *   schemas:
 *     HomeworkSubmission:
 *       type: object
 *       description: تسليم حل الواجب من قبل الطالب
 *       properties:
 *         id:
 *           type: integer
 *         homeworkId:
 *           type: integer
 *         studentId:
 *           type: integer
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fileUrl:
 *           type: string
 *           nullable: true
 *           description: رابط ملف الحل المرفوع
 *         status:
 *           $ref: '#/components/schemas/HomeworkStatus'
 *         score:
 *           type: number
 *           nullable: true
 *           description: الدرجة الممنوحة من المعلم (0 إلى 100)
 *         feedback:
 *           type: string
 *           nullable: true
 *           description: ملاحظات المعلم للطالب
 *         gradedBy:
 *           type: integer
 *           nullable: true
 *           description: معرف المستخدم (المعلم) الذي قام بالتصحيح
 *         gradedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         student:
 *           type: object
 *           nullable: true
 *           description: ملخص بيانات الطالب (يظهر في قائمة تسليمات المعلم)
 *         gradedByUser:
 *           type: object
 *           nullable: true
 *           description: ملخص المعلم المصحح (يظهر في استجابة الطالب عند مراجعة تسليمه)
 *     GradeSubmissionRequest:
 *       type: object
 *       required:
 *         - score
 *       properties:
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: الدرجة الممنوحة (من 0 إلى 100)
 *         feedback:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           description: ملاحظات المعلم للطالب
 *     HomeworkSubmissionResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/HomeworkSubmission'
 *     HomeworkSubmissionsResponse:
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
 *             $ref: '#/components/schemas/HomeworkSubmission'
 */
