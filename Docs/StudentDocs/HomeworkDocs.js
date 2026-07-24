/**
 * @swagger
 * tags:
 *   name: Student - Homeworks
 *   description: عرض الواجبات الخاصة بالطالب
 */

/**
 * @swagger
 * /api/student/homeworks:
 *   get:
 *     summary: جلب الواجبات الخاصة بالطالب بناءً على شعبه
 *     tags: [Student - Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: integer
 *         description: التصفية حسب المادة (اختياري)
 *     responses:
 *       200:
 *         description: تم جلب الواجبات بنجاح
 *       404:
 *         description: الطالب غير موجود
 */
