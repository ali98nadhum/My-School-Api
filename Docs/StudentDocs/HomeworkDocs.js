/**
 * @swagger
 * /api/student/homeworks:
 *   get:
 *     summary: جلب الواجبات الخاصة بالطالب بناءً على شعبه
 *     operationId: getStudentHomeworks
 *     tags: [🎓 الطالب - الواجبات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         required: false
 *         schema:
 *           type: integer
 *         description: التصفية حسب المادة (اختياري)
 *     responses:
 *       200:
 *         description: تم جلب الواجبات بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentHomeworksResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: الطالب غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
