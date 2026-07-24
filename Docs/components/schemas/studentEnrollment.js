/**
 * @swagger
 * components:
 *   schemas:
 *     StudentEnrollment:
 *       type: object
 *       description: سجل التسجيل الأكاديمي للطالب (يحفظ تاريخه الأكاديمي عبر السنوات)
 *       properties:
 *         id:
 *           type: integer
 *         studentId:
 *           type: integer
 *         classId:
 *           type: integer
 *           description: الصف الدراسي (يحتوي على السنة والمرحلة)
 *         sectionId:
 *           type: integer
 *           nullable: true
 *           description: الشعبة التي درس بها (اختياري)
 *         enrollmentDate:
 *           type: string
 *           format: date
 *         exitDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *         remarks:
 *           type: string
 *           nullable: true
 *         student:
 *           type: object
 *           nullable: true
 *           description: ملخص بيانات الطالب
 *         schoolClass:
 *           type: object
 *           nullable: true
 *           description: الصف الدراسي (مع المرحلة والسنة)
 *         section:
 *           type: object
 *           nullable: true
 *           description: الشعبة (إن وجدت)
 *     EnrollStudentRequest:
 *       type: object
 *       required:
 *         - studentId
 *         - classId
 *       properties:
 *         studentId:
 *           type: integer
 *           description: معرف الطالب
 *         classId:
 *           type: integer
 *           description: معرف الصف الدراسي
 *         sectionId:
 *           type: integer
 *           nullable: true
 *           description: معرف الشعبة (اختياري)
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           description: تاريخ التسجيل (افتراضياً اليوم)
 *         status:
 *           allOf:
 *             - $ref: '#/components/schemas/EnrollmentStatus'
 *           default: ACTIVE
 *     TransferSectionRequest:
 *       type: object
 *       required:
 *         - newSectionId
 *       properties:
 *         newSectionId:
 *           type: integer
 *           description: معرف الشعبة الجديدة المراد النقل إليها
 *     AssignSectionRequest:
 *       type: object
 *       required:
 *         - sectionId
 *       properties:
 *         sectionId:
 *           type: integer
 *           description: معرف الشعبة المراد تعيين الطالب بها
 *     UpdateEnrollmentStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *     EnrollmentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/StudentEnrollment'
 *     PaginatedEnrollmentsResponse:
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
 *             $ref: '#/components/schemas/StudentEnrollment'
 */
