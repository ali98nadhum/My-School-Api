/**
 * @swagger
 * /api/management/attendance-reports/daily:
 *   get:
 *     summary: استخراج تقرير الحضور اليومي
 *     operationId: getDailyAttendance
 *     tags: [⏰ الإدارة - تقارير الحضور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: التاريخ المطلوب للتقرير (اختياري، الافتراضي هو اليوم)
 *       - in: query
 *         name: userType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [STUDENT, TEACHER, STAFF, PRINCIPAL, SUPER_ADMIN]
 *         description: الفلترة حسب نوع المستخدم (اختياري)
 *     responses:
 *       200:
 *         description: جلب بيانات الحضور اليومية بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyAttendanceReportResponse'
 *       400:
 *         description: تنسيق تاريخ غير صحيح
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: غير مصرح (لمدير المدرسة أو مدير النظام فقط)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
