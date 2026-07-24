/**
 * @swagger
 * /api/device/sync:
 *   post:
 *     summary: استقبال بصمة دخول/خروج من جهاز البصمة
 *     operationId: syncBiometricData
 *     tags: [🛡️ النظام - مزامنة البصمة]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncBiometricRequest'
 *     responses:
 *       200:
 *         description: تم تسجيل البصمة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncBiometricResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة (كود أو تاريخ/وقت غير صحيح)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: لم يتم العثور على مستخدم يحمل هذا الكود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
