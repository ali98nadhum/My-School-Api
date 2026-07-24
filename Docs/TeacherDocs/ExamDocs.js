/**
 * @swagger
 * /api/teacher/exams:
 *   post:
 *     summary: إنشاء امتحان جديد (Create Exam)
 *     operationId: createTeacherExam
 *     tags: [👨‍🏫 المعلم - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExamRequest'
 *     responses:
 *       201:
 *         description: تم إنشاء الامتحان بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة، أو تم إنشاء هذا الامتحان مسبقاً لنفس الشعبة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: أنت لا تدرس هذه المادة لهذه الشعبة، غير مصرح لك بإنشاء امتحان
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: حساب المعلم أو السنة الدراسية أو نوع الامتحان غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: جلب الامتحانات الخاصة بالمعلم
 *     operationId: getTeacherExams
 *     tags: [👨‍🏫 المعلم - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AcademicYearIdFilterParam'
 *       - $ref: '#/components/parameters/SectionIdFilterParam'
 *       - $ref: '#/components/parameters/SubjectIdFilterParam'
 *       - $ref: '#/components/parameters/ExamTypeIdFilterParam'
 *     responses:
 *       200:
 *         description: قائمة الامتحانات
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: حساب المعلم غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/teacher/exams/{id}:
 *   put:
 *     summary: تعديل بيانات الامتحان
 *     operationId: updateTeacherExam
 *     tags: [👨‍🏫 المعلم - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ExamIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExamRequest'
 *     responses:
 *       200:
 *         description: تم تعديل الامتحان بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح لك بتعديل هذا الامتحان لأنك لم تقم بإنشائه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الامتحان غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: حذف الامتحان
 *     operationId: deleteTeacherExam
 *     tags: [👨‍🏫 المعلم - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ExamIdParam'
 *     responses:
 *       204:
 *         description: تم حذف الامتحان بنجاح (بدون محتوى)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح لك بحذف هذا الامتحان لأنك لم تقم بإنشائه
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: الامتحان غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
