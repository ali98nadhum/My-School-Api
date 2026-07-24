/**
 * @swagger
 * components:
 *   schemas:
 *     FeeType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف نوع الرسم
 *         nameAr:
 *           type: string
 *           nullable: true
 *           description: اسم نوع الرسم بالعربية
 *         nameEn:
 *           type: string
 *           nullable: true
 *           description: اسم نوع الرسم بالإنجليزية
 *         description:
 *           type: string
 *           nullable: true
 *           description: وصف إضافي لنوع الرسم
 *     CreateFeeTypeRequest:
 *       type: object
 *       required:
 *         - nameAr
 *       properties:
 *         nameAr:
 *           type: string
 *           example: "رسوم دراسية"
 *           description: اسم نوع الرسم بالعربية (حرفان على الأقل)
 *         nameEn:
 *           type: string
 *           example: "Tuition Fee"
 *           description: اسم نوع الرسم بالإنجليزية (اختياري)
 *         description:
 *           type: string
 *           description: وصف إضافي لنوع الرسم (اختياري)
 *     UpdateFeeTypeRequest:
 *       type: object
 *       properties:
 *         nameAr:
 *           type: string
 *           description: اسم نوع الرسم بالعربية (حرفان على الأقل)
 *         nameEn:
 *           type: string
 *           description: اسم نوع الرسم بالإنجليزية
 *         description:
 *           type: string
 *           description: وصف إضافي لنوع الرسم
 *     FeeTypeResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/FeeType'
 *     FeeTypesResponse:
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
 *             $ref: '#/components/schemas/FeeType'
 *     FeeStructure:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: معرف هيكلية الرسم
 *         gradeLevelId:
 *           type: integer
 *           description: معرف المرحلة الدراسية
 *         academicYearId:
 *           type: integer
 *           description: معرف السنة الدراسية
 *         feeTypeId:
 *           type: integer
 *           description: معرف نوع الرسم
 *         amount:
 *           type: string
 *           nullable: true
 *           example: "5000.00"
 *           description: قيمة الرسم (رقم عشري يُعاد كنص)
 *         gradeLevel:
 *           type: object
 *           nullable: true
 *           description: تفاصيل المرحلة الدراسية (تظهر في قائمة هيكليات الرسوم)
 *         academicYear:
 *           type: object
 *           nullable: true
 *           description: تفاصيل السنة الدراسية (تظهر في قائمة هيكليات الرسوم)
 *         feeType:
 *           type: object
 *           nullable: true
 *           description: تفاصيل نوع الرسم (تظهر في قائمة هيكليات الرسوم)
 *     CreateFeeStructureRequest:
 *       type: object
 *       required:
 *         - gradeLevelId
 *         - academicYearId
 *         - feeTypeId
 *         - amount
 *       properties:
 *         gradeLevelId:
 *           type: integer
 *           description: معرف المرحلة الدراسية
 *         academicYearId:
 *           type: integer
 *           description: معرف السنة الدراسية
 *         feeTypeId:
 *           type: integer
 *           description: معرف نوع الرسم
 *         amount:
 *           type: number
 *           example: 5000
 *           description: قيمة الرسم (رقم موجب)
 *     UpdateFeeStructureRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           example: 5500
 *           description: قيمة الرسم الجديدة (رقم موجب)
 *     FeeStructureResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/FeeStructure'
 *     FeeStructuresResponse:
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
 *             $ref: '#/components/schemas/FeeStructure'
 */
