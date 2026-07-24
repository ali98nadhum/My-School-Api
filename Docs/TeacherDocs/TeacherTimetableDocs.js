/**
 * @swagger
 * /api/teacher/timetable:
 *   get:
 *     summary: Get the logged-in teacher's timetable
 *     description: Retrieve the timetable for the logged-in teacher. Can be filtered by a specific day of the week.
 *     operationId: getMyTimetable
 *     tags: [👨‍🏫 المعلم - جدولي الدراسي]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dayOfWeek
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         description: Filter by day of the week
 *     responses:
 *       200:
 *         description: Successful retrieval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyTimetableResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Not authorized (Must be a TEACHER)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Teacher profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
