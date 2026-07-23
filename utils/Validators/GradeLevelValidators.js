const { z } = require("zod");

const createGradeLevelSchema = z.object({
  body: z.object({
    nameEn: z.string({
      required_error: "الاسم بالإنجليزية مطلوب",
    }).min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50, "الاسم يجب ألا يتجاوز 50 حرفاً"),
    nameAr: z.string({
      required_error: "الاسم بالعربية مطلوب",
    }).min(2, "الاسم يجب أن يكون حرفين على الأقل").max(50, "الاسم يجب ألا يتجاوز 50 حرفاً"),
    sortOrder: z.number({
      required_error: "الترتيب مطلوب",
    }).int("الترتيب يجب أن يكون رقماً صحيحاً").positive("الترتيب يجب أن يكون رقماً موجباً"),
  })
});

const updateGradeLevelSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    nameEn: z.string().min(2).max(50).optional(),
    nameAr: z.string().min(2).max(50).optional(),
    sortOrder: z.number().int().positive().optional(),
  })
});

const getGradeLevelSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createGradeLevelSchema,
  updateGradeLevelSchema,
  getGradeLevelSchema
};
