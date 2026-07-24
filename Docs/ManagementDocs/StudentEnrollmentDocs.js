/**
 * @swagger
 * /api/management/enrollments:
 *   get:
 *     summary: جلب جميع الطلاب
 *     operationId: getEnrollments
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by student ID
 *       - $ref: '#/components/parameters/ClassIdFilterParam'
 *       - $ref: '#/components/parameters/SectionIdFilterParam'
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/EnrollmentStatus'
 *         description: Filter by status
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: A list of student enrollments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEnrollmentsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Enroll a student into a school class (and optionally a section)
 *     operationId: enrollStudent
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollStudentRequest'
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation error, class/section already enrolled, or section capacity full
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
 *         description: Student, school class, or section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/{id}:
 *   get:
 *     summary: جلب طالب معين من خلال المعرف
 *     operationId: getEnrollmentById
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/EnrollmentIdParam'
 *     responses:
 *       200:
 *         description: Enrollment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/assign-section:
 *   put:
 *     summary: Assign a student to a section (if not already assigned)
 *     operationId: assignStudentSection
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/EnrollmentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignSectionRequest'
 *     responses:
 *       200:
 *         description: Student assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Student already has a section (use transfer instead), section capacity full, or section incompatible with class
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
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/transfer:
 *   put:
 *     summary: Transfer a student to a different section
 *     operationId: transferStudentSection
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/EnrollmentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferSectionRequest'
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Student already in this section, section capacity full, or section incompatible with class
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
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/remove-section:
 *   put:
 *     summary: Remove student from section (keeps enrollment in the class)
 *     operationId: removeStudentFromSection
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/EnrollmentIdParam'
 *     responses:
 *       200:
 *         description: Student removed from section successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Student is not currently assigned to any section
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
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/status:
 *   put:
 *     summary: Update student enrollment status
 *     operationId: updateEnrollmentStatus
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/EnrollmentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnrollmentStatusRequest'
 *     responses:
 *       200:
 *         description: Enrollment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Enrollment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/enrollments/promote:
 *   post:
 *     summary: ترحيل الطالب يدوياً لصف جديد في سنة دراسية جديدة
 *     tags: [⏰ الإدارة - نقل وتوزيع الطلاب]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - newClassId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 1
 *               newClassId:
 *                 type: integer
 *                 example: 2
 *               newSectionId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: تم ترحيل الطالب بنجاح إلى الصف الجديد.
 *       400:
 *         description: خطأ في بيانات الطالب أو لا يوجد له تسجيل أكاديمي نشط.
 *       404:
 *         description: الطالب أو الصف غير موجود.
 */
