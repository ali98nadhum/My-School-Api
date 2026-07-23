const { z } = require("zod");

const createSchoolClassSchema = z.object({
  body: z.object({
    gradeLevelId: z.number({
      required_error: "معرف المرحلة الدراسية مطلوب",
    }).int("معرف المرحلة الدراسية يجب أن يكون رقماً صحيحاً").positive(),
    academicYearId: z.number({
      required_error: "معرف السنة الدراسية مطلوب",
    }).int("معرف السنة الدراسية يجب أن يكون رقماً صحيحاً").positive(),
    nameEn: z.string().min(2).max(50).optional(),
    nameAr: z.string().min(2).max(50).optional(),
  })
});

const updateSchoolClassSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    nameEn: z.string().min(2).max(50).optional(),
    nameAr: z.string().min(2).max(50).optional(),
  })
});

const getSchoolClassSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createSchoolClassSchema,
  updateSchoolClassSchema,
  getSchoolClassSchema
};
