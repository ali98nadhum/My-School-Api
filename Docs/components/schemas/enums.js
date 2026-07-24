/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [SUPER_ADMIN, PRINCIPAL, TEACHER, STUDENT, PARENT, ACCOUNTANT, ADMINISTRATOR]
 *       description: صلاحيات المستخدمين
 *     GuardianRelationship:
 *       type: string
 *       enum: [FATHER, MOTHER, GRANDFATHER, GRANDMOTHER, UNCLE, AUNT, BROTHER, SISTER, LEGAL_GUARDIAN, OTHER]
 *       description: صلة القرابة
 *     Gender:
 *       type: string
 *       enum: [MALE, FEMALE]
 *       description: الجنس
 *     DayOfWeek:
 *       type: string
 *       enum: [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]
 *       description: أيام الأسبوع
 *     AttachmentType:
 *       type: string
 *       enum: [IMAGE, VIDEO, PDF, YOUTUBE_LINK]
 *       description: نوع المرفق
 *     AttachmentStatus:
 *       type: string
 *       enum: [PROCESSING, READY, FAILED]
 *       description: حالة المرفق
 *     EnrollmentStatus:
 *       type: string
 *       enum: [ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED, SUSPENDED]
 *       description: حالة التسجيل الأكاديمي
 *     AttendanceStatus:
 *       type: string
 *       enum: [PRESENT, ABSENT, LATE, EXCUSED, HALF_DAY]
 *       description: حالة الحضور والغياب
 *     InvoiceStatus:
 *       type: string
 *       enum: [UNPAID, PARTIAL, PAID, OVERDUE, CANCELLED]
 *       description: حالة الفاتورة
 *     PaymentMethod:
 *       type: string
 *       enum: [CASH, CARD, BANK_TRANSFER, ONLINE, CHEQUE]
 *       description: طريقة الدفع
 *     HomeworkStatus:
 *       type: string
 *       enum: [ASSIGNED, SUBMITTED, LATE, MISSING, GRADED]
 *       description: حالة الواجب المنزلي
 *     ExpenseStatus:
 *       type: string
 *       enum: [PENDING, PAID, CANCELLED]
 *       description: حالة المصروفات
 */
