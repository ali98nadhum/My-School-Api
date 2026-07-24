const { z } = require("zod");

// Fee Type Validators
const createFeeTypeSchema = z.object({
  body: z.object({
    nameAr: z.string().min(2, "اسم الرسم بالعربية مطلوب"),
    nameEn: z.string().optional(),
    description: z.string().optional()
  })
});

const updateFeeTypeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    nameAr: z.string().min(2, "اسم الرسم بالعربية مطلوب").optional(),
    nameEn: z.string().optional(),
    description: z.string().optional()
  })
});

// Fee Structure Validators
const createFeeStructureSchema = z.object({
  body: z.object({
    gradeLevelId: z.number().int().positive("معرف الصف الدراسي مطلوب"),
    academicYearId: z.number().int().positive("معرف السنة الدراسية مطلوب"),
    feeTypeId: z.number().int().positive("معرف نوع الرسم مطلوب"),
    amount: z.number().min(0, "المبلغ يجب أن يكون رقماً موجباً")
  })
});

const updateFeeStructureSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    amount: z.number().min(0, "المبلغ يجب أن يكون رقماً موجباً")
  })
});

module.exports = {
  createFeeTypeSchema,
  updateFeeTypeSchema,
  createFeeStructureSchema,
  updateFeeStructureSchema
};
