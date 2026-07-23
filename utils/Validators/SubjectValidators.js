const { z } = require("zod");

const createSubjectSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: "رمز المادة مطلوب",
    }).min(2).max(20),
    nameEn: z.string().min(2).max(100).optional(),
    nameAr: z.string().min(2).max(100).optional(),
    isActive: z.boolean().optional().default(true),
  }).refine((data) => data.nameEn || data.nameAr, {
    message: "يجب إدخال اسم المادة بالإنجليزية أو بالعربية  ",
    path: ["nameEn"],
  })
});

const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    code: z.string().min(2).max(20).optional(),
    nameEn: z.string().min(2).max(100).optional(),
    nameAr: z.string().min(2).max(100).optional(),
    isActive: z.boolean().optional(),
  })
});

const getSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema
};
