/**
 * @swagger
 * /api/student/homeworks/{homeworkId}/submissions:
 *   post:
 *     summary: رفع حل الواجب
 *     operationId: submitHomework
 *     tags: [🎓 الطالب - تسليم الواجب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/HomeworkRefParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SubmitHomeworkRequest'
 *     responses:
 *       201:
 *         description: تم رفع الحل بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkSubmissionResponse'
 *       400:
 *         description: خطأ في الملف، لم يتم إرفاق ملف الحل، أو قمت بالتسليم مسبقاً
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: ليس لديك صلاحية لتسليم هذا الواجب (ليس لشعبتك)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الواجب غير موجود، أو لم يتم العثور على بيانات الطالب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: مراجعة حل الواجب الخاص بي
 *     operationId: getMySubmission
 *     tags: [🎓 الطالب - تسليم الواجب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/HomeworkRefParam'
 *     responses:
 *       200:
 *         description: نجاح جلب بيانات التسليم الخاصة بك
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkSubmissionResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: لم تقم بتسليم هذا الواجب بعد، أو لم يتم العثور على بيانات الطالب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
