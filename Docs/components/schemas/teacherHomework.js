/**
 * @swagger
 * components:
 *   schemas:
 *     Homework:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         lessonId:
 *           type: integer
 *           nullable: true
 *           description: الدرس المرتبط بالواجب إن وجد
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         assignedDate:
 *           type: string
 *           format: date
 *         dueDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         attachmentUrl:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         subject:
 *           type: object
 *           nullable: true
 *           description: ملخص المادة (يظهر في قوائم واجبات المعلم والطالب)
 *         lesson:
 *           type: object
 *           nullable: true
 *           description: ملخص الدرس المرتبط (يظهر في قوائم واجبات المعلم والطالب)
 *         teacher:
 *           type: object
 *           nullable: true
 *           description: ملخص بيانات المعلم (يظهر في قائمة واجبات الطالب فقط)
 *         homeworkSections:
 *           type: array
 *           nullable: true
 *           description: الشُعب المكلّفة بهذا الواجب (يظهر في قائمة واجبات المعلم فقط)
 *           items:
 *             type: object
 *     CreateHomeworkRequest:
 *       type: object
 *       description: multipart/form-data - يدعم إرسال sectionIds كمصفوفة أو كقيم مفصولة بفواصل
 *       required:
 *         - sectionIds
 *         - subjectId
 *         - title
 *       properties:
 *         sectionIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: معرفات الشعب المكلّفة (يمكن إرسالها مفصولة بفواصل أو كمصفوفة)
 *         subjectId:
 *           type: integer
 *           description: معرف المادة
 *         lessonId:
 *           type: integer
 *           nullable: true
 *           description: معرف الدرس المرتبط (اختياري)
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: عنوان الواجب
 *         description:
 *           type: string
 *           nullable: true
 *           description: وصف تفصيلي للواجب
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: موعد التسليم
 *         attachment:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: ملف الواجب (صورة أو PDF)
 *     UpdateHomeworkRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *         description:
 *           type: string
 *           nullable: true
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     HomeworkResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Homework'
 *     HomeworksResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Homework'
 */
