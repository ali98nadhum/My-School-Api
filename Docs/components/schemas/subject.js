/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *           description: رمز المادة المميز (فريد)
 *         nameEn:
 *           type: string
 *           nullable: true
 *         nameAr:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           description: هل المادة مفعلة للاستخدام؟
 *     CreateSubjectRequest:
 *       type: object
 *       description: يجب إدخال اسم المادة بالإنجليزية أو بالعربية على الأقل
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: "PHY101"
 *           description: رمز المادة المميز (فريد، 2 إلى 20 حرفاً)
 *         nameEn:
 *           type: string
 *           example: "Physics"
 *           description: اسم المادة بالإنجليزية (مطلوب هو أو الاسم بالعربي)
 *         nameAr:
 *           type: string
 *           example: "الفيزياء"
 *           description: اسم المادة بالعربية (مطلوب هو أو الاسم بالإنجليزي)
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: هل المادة مفعلة للاستخدام؟ (افتراضياً true)
 *     UpdateSubjectRequest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         nameEn:
 *           type: string
 *         nameAr:
 *           type: string
 *         isActive:
 *           type: boolean
 *     SubjectResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/Subject'
 *     PaginatedSubjectsResponse:
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
 *             $ref: '#/components/schemas/Subject'
 */
