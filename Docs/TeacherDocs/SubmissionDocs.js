/**
 * @swagger
 * /api/teacher/homeworks/{homeworkId}/submissions:
 *   get:
 *     summary: استعراض جميع التسليمات الخاصة بواجب معين
 *     operationId: getHomeworkSubmissions
 *     tags: [👨‍🏫 المعلم - التصحيح والتسليمات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/HomeworkRefParam'
 *     responses:
 *       200:
 *         description: نجاح جلب التسليمات
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkSubmissionsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: ليس لديك صلاحية لرؤية تسليمات هذا الواجب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الواجب غير موجود، أو لم يتم العثور على بيانات المعلم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/teacher/submissions/{submissionId}/grade:
 *   put:
 *     summary: تصحيح وإعطاء درجة لمرفق الطالب
 *     operationId: gradeSubmission
 *     tags: [👨‍🏫 المعلم - التصحيح والتسليمات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SubmissionIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeSubmissionRequest'
 *     responses:
 *       200:
 *         description: تم التصحيح بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkSubmissionResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: ليس لديك صلاحية لتصحيح هذا الواجب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: التسليم غير موجود، أو لم يتم العثور على بيانات المعلم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
