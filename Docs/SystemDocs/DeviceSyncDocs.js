/**
 * @swagger
 * tags:
 *   name: 🛡️ النظام - مزامنة البصمة
 *   description: مسارات مزامنة أجهزة البصمة الخارجية
 */

/**
 * @swagger
 * /api/device/sync:
 *   post:
 *     summary: استقبال بصمة دخول/خروج من جهاز البصمة
 *     tags: [🛡️ النظام - مزامنة البصمة]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - timestamp
 *             properties:
 *               code:
 *                 type: string
 *                 description: الكود الوظيفي أو كود الطالب المرسل من الجهاز
 *                 example: "T-100"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: وقت البصمة بالضبط من الجهاز
 *                 example: "2026-10-10T08:00:00Z"
 *     responses:
 *       200:
 *         description: تم تسجيل البصمة بنجاح
 *       400:
 *         description: خطأ في البيانات المرسلة
 *       404:
 *         description: لم يتم العثور على الكود
 */
