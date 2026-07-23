/**
 * @swagger
 * tags:
 *   name: StudentEnrollments
 *   description: Student Enrollment Management API (Principal, Administrator)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EnrollStudentRequest:
 *       type: object
 *       required:
 *         - studentId
 *         - academicYearId
 *         - sectionId
 *       properties:
 *         studentId:
 *           type: integer
 *           description: Student ID
 *         classId:
 *           type: integer
 *           description: School Class ID
 *         sectionId:
 *           type: integer
 *           description: Section ID (Optional)
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           description: Enrollment Date
 *         status:
 *           type: string
 *           enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *           description: Enrollment Status
 *     TransferSectionRequest:
 *       type: object
 *       required:
 *         - newSectionId
 *       properties:
 *         newSectionId:
 *           type: integer
 *           description: New Section ID to transfer the student to
 *     UpdateEnrollmentStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *           description: Enrollment Status
 */

/**
 * @swagger
 * /api/management/enrollments:
 *   get:
 *     summary: Get all student enrollments
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *         description: Filter by student ID
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         description: Filter by School Class ID
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *         description: Filter by Section ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *         description: Filter by Status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of student enrollments
 * 
 *   post:
 *     summary: Enroll a student into a school class (and optionally a section)
 *     tags: [StudentEnrollments]
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
 *       400:
 *         description: Validation error or Capacity full
 */

/**
 * @swagger
 * /api/management/enrollments/{id}:
 *   get:
 *     summary: Get a specific student enrollment by ID
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment data
 *       404:
 *         description: Enrollment not found
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/assign-section:
 *   put:
 *     summary: Assign a student to a section (if not already assigned)
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferSectionRequest'
 *     responses:
 *       200:
 *         description: Student assigned successfully
 *       400:
 *         description: Section capacity full or section incompatible
 *
 * @swagger
 * /api/management/enrollments/{id}/transfer:
 *   put:
 *     summary: Transfer a student to a different section
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferSectionRequest'
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *       400:
 *         description: Section capacity full or section incompatible
 */

/**
 * @swagger
 * /api/management/enrollments/{id}/remove-section:
 *   put:
 *     summary: Remove student from section (keeps enrollment in the class)
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Student removed from section successfully
 *
 * @swagger
 * /api/management/enrollments/{id}/status:
 *   put:
 *     summary: Update student enrollment status
 *     tags: [StudentEnrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnrollmentStatusRequest'
 *     responses:
 *       200:
 *         description: Enrollment status updated successfully
 */
