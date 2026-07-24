/**
 * @swagger
 * tags:
 *   name: 🎓 الطالب - تسليم الواجبs
 *   description: مسارات تسليم الواجبات الخاصة بالطالب
 */

/**
 * @swagger
 * /api/student/homeworks/{homeworkId}/submissions:
 *   post:
 *     summary: رفع حل الواجب
 *     tags: [Student - Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: رقم الواجب
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - attachment
 *             properties:
 *               attachment:
 *                 type: string
 *                 format: binary
 *                 description: ملف الحل (صورة أو PDF)
 *     responses:
 *       201:
 *         description: تم رفع الحل بنجاح
 *       400:
 *         description: خطأ في الملف أو قمت بالتسليم مسبقاً
 *       403:
 *         description: ليس لديك صلاحية لتسليم هذا الواجب (ليس لشعبتك)
 *       404:
 *         description: الواجب غير موجود
 *
 *   get:
 *     summary: مراجعة حل الواجب الخاص بي
 *     tags: [Student - Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: رقم الواجب
 *     responses:
 *       200:
 *         description: نجاح جلب بيانات التسليم الخاصة بك
 *       404:
 *         description: لم تقم بتسليم هذا الواجب بعد
 */
