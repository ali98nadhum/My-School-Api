/**
 * @swagger
 * /api/teacher/homeworks:
 *   post:
 *     summary: إنشاء واجب جديد وتعيينه لشعبة واحدة أو عدة شعب
 *     operationId: createHomework
 *     tags: [👨‍🏫 المعلم - الواجبات]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateHomeworkRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء الواجب بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkResponse'
 *       400:
 *         description: أخطاء في البيانات المرسلة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: ليس لديك صلاحية لإعطاء واجب لهذه المادة في جميع الشعب المحددة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: لم يتم العثور على المعلم أو بعض الشعب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: جلب الواجبات الخاصة بالمعلم
 *     operationId: getTeacherHomeworks
 *     tags: [👨‍🏫 المعلم - الواجبات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SectionIdFilterParam'
 *       - in: query
 *         name: subjectId
 *         required: false
 *         schema:
 *           type: integer
 *         description: التصفية حسب المادة (اختياري)
 *     responses:
 *       200:
 *         description: قائمة الواجبات
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworksResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: لم يتم العثور على بيانات المعلم
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/teacher/homeworks/{id}:
 *   put:
 *     summary: تعديل بيانات الواجب
 *     operationId: updateHomework
 *     tags: [👨‍🏫 المعلم - الواجبات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherHomeworkIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHomeworkRequest'
 *     responses:
 *       200:
 *         description: تم تعديل الواجب
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeworkResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: لا تملك صلاحية تعديل هذا الواجب
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
 *   delete:
 *     summary: حذف الواجب
 *     operationId: deleteHomework
 *     tags: [👨‍🏫 المعلم - الواجبات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TeacherHomeworkIdParam'
 *     responses:
 *       200:
 *         description: تم الحذف بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: لا تملك صلاحية حذف هذا الواجب
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
