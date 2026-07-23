/**
 * @swagger
 * components:
 *   schemas:
 *     TimetableEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Timetable entry ID
 *         sectionId:
 *           type: integer
 *           description: Section ID
 *         subjectId:
 *           type: integer
 *           description: Subject ID
 *         teacherId:
 *           type: integer
 *           description: Teacher ID
 *         periodId:
 *           type: integer
 *           description: Period ID
 *         dayOfWeek:
 *           type: string
 *           enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *           description: Day of the week
 *         room:
 *           type: string
 *           description: Room or Hall Name
 *         academicYearId:
 *           type: integer
 *           description: Academic Year ID
 * 
 *     TimetableEntryCreate:
 *       type: object
 *       required:
 *         - sectionId
 *         - subjectId
 *         - teacherId
 *         - periodId
 *         - dayOfWeek
 *         - academicYearId
 *       properties:
 *         sectionId:
 *           type: integer
 *         subjectId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         periodId:
 *           type: integer
 *         dayOfWeek:
 *           type: string
 *           enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *         room:
 *           type: string
 *         academicYearId:
 *           type: integer
 * 
 *     TimetableBatchCreate:
 *       type: object
 *       required:
 *         - entries
 *       properties:
 *         entries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimetableEntryCreate'
 * 
 * tags:
 *   name: Timetables
 *   description: Timetable management endpoints
 */

/**
 * @swagger
 * /api/management/timetables:
 *   get:
 *     summary: Get timetable entries with filters
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         schema:
 *           type: integer
 *         description: Filter by Section ID
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: integer
 *         description: Filter by Teacher ID
 *       - in: query
 *         name: dayOfWeek
 *         schema:
 *           type: string
 *           enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *         description: Filter by day of the week
 *       - in: query
 *         name: academicYearId
 *         schema:
 *           type: integer
 *         description: Filter by Academic Year ID
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
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of timetable entries
 * 
 *   post:
 *     summary: Create a single timetable entry
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimetableEntryCreate'
 *     responses:
 *       201:
 *         description: Entry created successfully
 *       400:
 *         description: Conflict detected (Teacher or Section already busy)
 * 
 * /api/management/timetables/batch:
 *   post:
 *     summary: Batch create multiple timetable entries at once
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimetableBatchCreate'
 *     responses:
 *       201:
 *         description: Entries created successfully
 *       400:
 *         description: Conflict detected
 * 
 * /api/management/timetables/{id}:
 *   get:
 *     summary: Get timetable entry by ID
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry details
 *       404:
 *         description: Entry not found
 * 
 *   put:
 *     summary: Update timetable entry
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *               subjectId:
 *                 type: integer
 *               teacherId:
 *                 type: integer
 *               periodId:
 *                 type: integer
 *               dayOfWeek:
 *                 type: string
 *                 enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *     responses:
 *       200:
 *         description: Entry updated successfully
 *       400:
 *         description: Conflict detected
 * 
 *   delete:
 *     summary: Delete timetable entry
 *     tags: [Timetables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Entry deleted successfully
 */
