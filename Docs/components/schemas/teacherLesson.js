/**
 * @swagger
 * components:
 *   schemas:
 *     LessonAttachment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         lessonId:
 *           type: integer
 *         type:
 *           $ref: '#/components/schemas/AttachmentType'
 *         url:
 *           type: string
 *           description: المسار المحلي أو الرابط
 *         name:
 *           type: string
 *           nullable: true
 *         status:
 *           allOf:
 *             - $ref: '#/components/schemas/AttachmentStatus'
 *           description: تُستخدم لمراقبة حالة رفع الفيديو أو ضغطه في الخلفية
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         academicYearId:
 *           type: integer
 *         title:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         lessonDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LessonAttachment'
 *         subject:
 *           type: object
 *           nullable: true
 *           description: ملخص المادة (يظهر في قائمة دروس الشعبة)
 *     CreateLessonRequest:
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
 *           description: معرفات الشعب (يمكن إرسالها مفصولة بفواصل أو كمصفوفة)
 *         subjectId:
 *           type: integer
 *           description: معرف المادة
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: عنوان الدرس
 *         description:
 *           type: string
 *           nullable: true
 *           description: وصف الدرس (اختياري)
 *         lessonDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: تاريخ الدرس (اختياري)
 *         youtubeUrl:
 *           type: string
 *           nullable: true
 *           description: رابط يوتيوب صالح (اختياري)
 *         image:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: صورة غلاف للدرس (اختياري)
 *         video:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: فيديو الدرس (يُعالج في الخلفية، أقصى مدة 60 دقيقة)
 *         pdf:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: ملف PDF مرفق للدرس
 *     UpdateLessonRequest:
 *       type: object
 *       description: multipart/form-data - لا يمكن تحديث المرفقات (video/pdf) من هذا المسار
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *         description:
 *           type: string
 *           nullable: true
 *         lessonDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         youtubeUrl:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *           format: binary
 *           nullable: true
 *           description: صورة غلاف جديدة (اختياري)
 *     LessonResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Lesson'
 *     LessonsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lesson'
 */
