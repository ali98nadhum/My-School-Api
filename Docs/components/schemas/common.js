/**
 * @swagger
 * components:
 *   schemas:
 *     Pagination:
 *       type: object
 *       description: بيانات الترقيم المرفقة مع نتائج القوائم
 *       properties:
 *         total:
 *           type: integer
 *           description: إجمالي عدد العناصر المطابقة للفلاتر
 *         page:
 *           type: integer
 *           description: رقم الصفحة الحالية
 *         limit:
 *           type: integer
 *           description: عدد العناصر في الصفحة الواحدة
 *         totalPages:
 *           type: integer
 *           description: إجمالي عدد الصفحات
 *     ErrorResponse:
 *       type: object
 *       description: الشكل الموحد لكل استجابات الأخطاء في النظام (يُنتج بواسطة Middlewares/errorHandler.js)
 *       properties:
 *         status:
 *           type: string
 *           enum: [fail, error]
 *           description: "'fail' لأخطاء العميل (4xx)، و'error' لأخطاء الخادم (5xx)"
 *         message:
 *           type: string
 *           description: وصف نصي للخطأ (رسائل التحقق من صحة البيانات المتعددة تُدمج في رسالة واحدة مفصولة بفواصل)
 */
