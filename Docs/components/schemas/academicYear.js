/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicYear:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         schoolId:
 *           type: integer
 *           description: معرف المدرسة التابعة لها
 *         name:
 *           type: string
 *           description: اسم السنة الدراسية (مثل 2025/2026)
 *         startDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         isCurrent:
 *           type: boolean
 *           description: هل هي السنة الدراسية الحالية النشطة لهذه المدرسة؟
 *     CreateAcademicYearRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "2025/2026"
 *           description: اسم السنة الدراسية (3 إلى 20 حرفاً، فريد ضمن المدرسة)
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2026-06-30"
 *           description: يجب أن يكون بعد تاريخ البداية
 *         isCurrent:
 *           type: boolean
 *           example: true
 *     UpdateAcademicYearRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "2025/2026"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2026-06-30"
 *         isCurrent:
 *           type: boolean
 *           example: true
 *     AcademicYearResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/AcademicYear'
 *     AcademicYearsResponse:
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
 *             $ref: '#/components/schemas/AcademicYear'
 */
