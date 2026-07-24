/**
 * @swagger
 * components:
 *   schemas:
 *     GradeLevel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف المرحلة الدراسية
 *         nameEn:
 *           type: string
 *           nullable: true
 *           description: اسم المرحلة بالإنجليزية
 *         nameAr:
 *           type: string
 *           nullable: true
 *           description: اسم المرحلة بالعربية
 *         sortOrder:
 *           type: integer
 *           description: ترتيب المرحلة (فريد، يُستخدم لترتيب الصفوف منطقياً)
 *     CreateGradeLevelRequest:
 *       type: object
 *       required:
 *         - nameEn
 *         - nameAr
 *         - sortOrder
 *       properties:
 *         nameEn:
 *           type: string
 *           example: "First Grade"
 *           description: اسم المرحلة بالإنجليزية (حرفان إلى 50 حرفاً)
 *         nameAr:
 *           type: string
 *           example: "الأول الابتدائي"
 *           description: اسم المرحلة بالعربية (حرفان إلى 50 حرفاً)
 *         sortOrder:
 *           type: integer
 *           example: 1
 *           description: ترتيب المرحلة (رقم صحيح موجب وفريد)
 *     UpdateGradeLevelRequest:
 *       type: object
 *       properties:
 *         nameEn:
 *           type: string
 *         nameAr:
 *           type: string
 *         sortOrder:
 *           type: integer
 *     GradeLevelResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/GradeLevel'
 *     GradeLevelsResponse:
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
 *             $ref: '#/components/schemas/GradeLevel'
 */
