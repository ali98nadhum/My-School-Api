/**
 * @swagger
 * /api/management/exams/types:
 *   post:
 *     summary: إضافة نوع امتحان جديد (Create Exam Type)
 *     operationId: createExamType
 *     tags: [🏫 الإدارة - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExamTypeRequest'
 *     responses:
 *       201:
 *         description: تم إضافة نوع الامتحان بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamTypeResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: عرض جميع أنواع الامتحانات (Get Exam Types)
 *     operationId: getExamTypes
 *     tags: [🏫 الإدارة - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة أنواع الامتحانات
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamTypesResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/exams/types/{id}:
 *   put:
 *     summary: تعديل نوع امتحان (Update Exam Type)
 *     operationId: updateExamType
 *     tags: [🏫 الإدارة - الامتحانات]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ExamTypeIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExamTypeRequest'
 *     responses:
 *       200:
 *         description: تم تعديل نوع الامتحان بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamTypeResponse'
 *       400:
 *         description: خطأ في البيانات المرسلة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: نوع الامتحان غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/exams:
 *   post:
 *     summary: إنشاء امتحان جديد (Create Exam)
 *     operationId: createExam
 *     tags: [🏫 الإدارة - الامتحانات]
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
 *         description: خطأ في البيانات المرسلة، أو تم إنشاء هذا الامتحان مسبقاً لنفس الشعبة والمادة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: السنة الدراسية أو نوع الامتحان أو الشعبة أو المادة غير موجودة
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: عرض جميع الامتحانات (Get Exams)
 *     operationId: getExams
 *     tags: [🏫 الإدارة - الامتحانات]
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
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
