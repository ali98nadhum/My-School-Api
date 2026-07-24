/**
 * @swagger
 * components:
 *   parameters:
 *     PageParam:
 *       in: query
 *       name: page
 *       required: false
 *       schema:
 *         type: integer
 *         default: 1
 *       description: رقم الصفحة
 *     LimitParam:
 *       in: query
 *       name: limit
 *       required: false
 *       schema:
 *         type: integer
 *         default: 10
 *       description: عدد العناصر في الصفحة الواحدة
 *     SearchParam:
 *       in: query
 *       name: search
 *       required: false
 *       schema:
 *         type: string
 *       description: بحث نصي حر (يختلف نطاق الحقول المشمولة حسب المورد)
 */
