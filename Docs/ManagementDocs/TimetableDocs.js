/**
 * @swagger
 * /api/management/timetables:
 *   get:
 *     summary: Get timetable entries with filters
 *     operationId: getTimetableEntries
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SectionIdFilterParam'
 *       - in: query
 *         name: teacherId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by Teacher ID
 *       - in: query
 *         name: dayOfWeek
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         description: Filter by day of the week
 *       - $ref: '#/components/parameters/AcademicYearIdFilterParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: عدد العناصر في الصفحة الواحدة (الافتراضي هنا 20، أعلى من بقية القوائم)
 *     responses:
 *       200:
 *         description: List of timetable entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTimetableEntriesResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a single timetable entry
 *     operationId: createTimetableEntry
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimetableEntryRequest'
 *     responses:
 *       201:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimetableEntryResponse'
 *       400:
 *         description: Referenced section/subject/teacher/academic year not found or not owned by school
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
 *         description: Referenced section, subject, teacher, or academic year not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict detected (Teacher or Section already busy in the same day/period)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/timetables/batch:
 *   post:
 *     summary: Batch create multiple timetable entries at once
 *     operationId: batchCreateTimetableEntries
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchCreateTimetableEntriesRequest'
 *     responses:
 *       201:
 *         description: Entries created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Referenced entities not found or not owned by school
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
 *         description: Referenced entities not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict detected (Teacher or Section already busy)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/management/timetables/{id}:
 *   get:
 *     summary: Get timetable entry by ID
 *     operationId: getTimetableEntryById
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TimetableIdParam'
 *     responses:
 *       200:
 *         description: Entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimetableEntryResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update timetable entry
 *     operationId: updateTimetableEntry
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TimetableIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTimetableEntryRequest'
 *     responses:
 *       200:
 *         description: Entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimetableEntryResponse'
 *       400:
 *         description: Referenced entities not found or not owned by school
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
 *         description: Entry not found, or referenced entities not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict detected (Teacher or Section already busy)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete timetable entry
 *     operationId: deleteTimetableEntry
 *     tags: [🏫 الإدارة - الجداول الدراسية]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TimetableIdParam'
 *     responses:
 *       204:
 *         description: Entry deleted successfully (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
