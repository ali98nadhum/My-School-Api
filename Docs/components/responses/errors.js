/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: خطأ في البيانات المرسلة (فشل التحقق من الصحة، أو انتهاك قاعدة عمل)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: غير مصرح - التوكن مفقود، غير صالح، أو منتهي الصلاحية
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: ممنوع - المستخدم مسجل دخول لكن لا يملك الصلاحية الكافية لهذا الإجراء
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: العنصر المطلوب غير موجود
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Conflict:
 *       description: تعارض - يوجد سجل آخر بنفس القيمة الفريدة (خطأ Prisma P2002)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     InternalServerError:
 *       description: خطأ غير متوقع في الخادم
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
