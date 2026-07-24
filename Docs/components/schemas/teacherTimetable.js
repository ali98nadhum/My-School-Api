/**
 * @swagger
 * components:
 *   schemas:
 *     MyTimetableResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         results:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimetableEntry'
 */
