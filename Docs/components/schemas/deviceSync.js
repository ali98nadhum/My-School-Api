/**
 * @swagger
 * components:
 *   schemas:
 *     SyncBiometricRequest:
 *       type: object
 *       required:
 *         - code
 *         - timestamp
 *       properties:
 *         code:
 *           type: string
 *           example: "T-100"
 *           description: الكود الوظيفي أو كود الطالب المرسل من الجهاز
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T08:00:00Z"
 *           description: وقت البصمة بالضبط من الجهاز
 *     DailyAttendance:
 *       type: object
 *       description: سجل الحضور اليومي الموحّد (بصمة دخول/خروج) للطالب أو المعلم أو الموظف
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *           description: تاريخ اليوم (بداية اليوم بتوقيت UTC)
 *         userType:
 *           $ref: '#/components/schemas/UserRole'
 *         referenceId:
 *           type: integer
 *           description: معرف الشخص (الطالب/المعلم/الموظف) حسب userType
 *         checkInTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: وقت أول بصمة في اليوم (تسجيل الدخول)
 *         checkOutTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: وقت آخر بصمة لاحقة في نفس اليوم (تسجيل الخروج)
 *         status:
 *           $ref: '#/components/schemas/AttendanceStatus'
 *     SyncBiometricResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/DailyAttendance'
 */
