/**
 * @swagger
 * tags:
 *   name: Teacher Timetable
 *   description: Teacher personal timetable endpoints
 */

/**
 * @swagger
 * /api/teacher/timetable:
 *   get:
 *     summary: Get the logged-in teacher's timetable
 *     description: Retrieve the timetable for the logged-in teacher. Can be filtered by a specific day of the week.
 *     tags: [Teacher Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dayOfWeek
 *         schema:
 *           type: string
 *           enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *         description: Filter by day of the week
 *     responses:
 *       200:
 *         description: Successful retrieval
 *       403:
 *         description: Not authorized (Must be a TEACHER)
 *       404:
 *         description: Teacher profile not found
 */
