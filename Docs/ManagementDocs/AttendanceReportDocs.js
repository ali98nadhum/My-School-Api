/**
 * @swagger
 * tags:
 *   name: ⏰ الإدارة - تقارير الحضور
 *   description: تقارير الحضور والغياب اليومية للإدارة
 */

/**
 * @swagger
 * /api/management/attendance-reports/daily:
 *   get:
 *     summary: استخراج تقرير الحضور اليومي
 *     tags: [⏰ الإدارة - تقارير الحضور]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: التاريخ المطلوب للتقرير (اختياري، الافتراضي هو اليوم)
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [STUDENT, TEACHER, STAFF, PRINCIPAL, SUPER_ADMIN]
 *         description: الفلترة حسب نوع المستخدم (اختياري)
 *     responses:
 *       200:
 *         description: جلب بيانات الحضور اليومية بنجاح
 *       400:
 *         description: تنسيق تاريخ غير صحيح
 */
