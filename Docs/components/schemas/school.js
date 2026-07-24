/**
 * @swagger
 * components:
 *   schemas:
 *     School:
 *       type: object
 *       description: كائن المدرسة كما يُعاد من قاعدة البيانات
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف المدرسة
 *         nameAr:
 *           type: string
 *           nullable: true
 *           description: اسم المدرسة بالعربية
 *         nameEn:
 *           type: string
 *           nullable: true
 *           description: اسم المدرسة بالإنجليزية
 *         address:
 *           type: string
 *           nullable: true
 *           description: عنوان المدرسة
 *         phone:
 *           type: string
 *           nullable: true
 *           description: رقم هاتف المدرسة
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: تاريخ الإنشاء
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: تاريخ آخر تعديل
 *     CreateSchoolRequest:
 *       type: object
 *       description: يجب إدخال الاسم العربي أو الاسم الإنجليزي على الأقل
 *       properties:
 *         nameAr:
 *           type: string
 *           example: مدرسة الأمل
 *           description: اسم المدرسة بالعربية (مطلوب هو أو الاسم الإنجليزي)
 *         nameEn:
 *           type: string
 *           example: Al Amal School
 *           description: اسم المدرسة بالإنجليزية (مطلوب هو أو الاسم العربي)
 *         address:
 *           type: string
 *           example: بغداد - الكرادة
 *           description: عنوان المدرسة
 *         phone:
 *           type: string
 *           example: "07700000000"
 *           description: رقم هاتف المدرسة (صيغة عراقية)
 *     UpdateSchoolRequest:
 *       type: object
 *       properties:
 *         nameAr:
 *           type: string
 *           description: اسم المدرسة بالعربية
 *         nameEn:
 *           type: string
 *           description: اسم المدرسة بالإنجليزية
 *         address:
 *           type: string
 *           description: عنوان المدرسة
 *         phone:
 *           type: string
 *           description: رقم هاتف المدرسة (صيغة عراقية)
 *     SchoolResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             school:
 *               $ref: '#/components/schemas/School'
 *     PaginatedSchoolsResponse:
 *       type: object
 *       description: "ملاحظة: بيانات الترقيم متداخلة داخل data (على خلاف بقية القوائم في النظام)"
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             schools:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 */
