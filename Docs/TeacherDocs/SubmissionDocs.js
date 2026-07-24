/**
 * @swagger
 * tags:
 *   name: Teacher - Submissions
 *   description: مسارات تصحيح ومراجعة تسليمات الواجبات الخاصة بالمعلم
 */

/**
 * @swagger
 * /api/teacher/homeworks/{homeworkId}/submissions:
 *   get:
 *     summary: استعراض جميع التسليمات الخاصة بواجب معين
 *     tags: [Teacher - Submissions]
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
 *         description: نجاح جلب التسليمات
 *       403:
 *         description: ليس لديك صلاحية لرؤية تسليمات هذا الواجب
 *       404:
 *         description: الواجب غير موجود
 */

/**
 * @swagger
 * /api/teacher/submissions/{submissionId}/grade:
 *   put:
 *     summary: تصحيح وإعطاء درجة لمرفق الطالب
 *     tags: [Teacher - Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: رقم التسليم
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 description: الدرجة الممنوحة (من 0 إلى 100)
 *               feedback:
 *                 type: string
 *                 description: ملاحظات المعلم للطالب
 *     responses:
 *       200:
 *         description: تم التصحيح بنجاح
 *       400:
 *         description: خطأ في البيانات المرسلة
 *       403:
 *         description: ليس لديك صلاحية لتصحيح هذا الواجب
 *       404:
 *         description: التسليم غير موجود
 */
