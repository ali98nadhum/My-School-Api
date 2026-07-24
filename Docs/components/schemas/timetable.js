/**
 * @swagger
 * components:
 *   schemas:
 *     TimetableEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف سجل الجدول
 *         sectionId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         periodId:
 *           type: integer
 *         dayOfWeek:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         room:
 *           type: string
 *           nullable: true
 *           description: رقم/اسم القاعة
 *         academicYearId:
 *           type: integer
 *         section:
 *           type: object
 *           nullable: true
 *           description: ملخص الشعبة (مع اسم الصف)
 *         subject:
 *           type: object
 *           nullable: true
 *           description: ملخص المادة
 *         teacher:
 *           type: object
 *           nullable: true
 *           description: ملخص المعلم
 *         period:
 *           type: object
 *           nullable: true
 *           description: بيانات الحصة (الاسم، وقت البداية والنهاية)
 *     CreateTimetableEntryRequest:
 *       type: object
 *       required:
 *         - sectionId
 *         - subjectId
 *         - teacherId
 *         - periodId
 *         - dayOfWeek
 *         - academicYearId
 *       properties:
 *         sectionId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         periodId:
 *           type: integer
 *         dayOfWeek:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         room:
 *           type: string
 *           nullable: true
 *           maxLength: 30
 *         academicYearId:
 *           type: integer
 *     BatchCreateTimetableEntriesRequest:
 *       type: object
 *       required:
 *         - entries
 *       properties:
 *         entries:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/CreateTimetableEntryRequest'
 *     UpdateTimetableEntryRequest:
 *       type: object
 *       description: يجب توفير حقل واحد على الأقل
 *       properties:
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         periodId:
 *           type: integer
 *         dayOfWeek:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         room:
 *           type: string
 *           nullable: true
 *           maxLength: 30
 *     TimetableEntryResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/TimetableEntry'
 *     PaginatedTimetableEntriesResponse:
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
 *             $ref: '#/components/schemas/TimetableEntry'
 */
