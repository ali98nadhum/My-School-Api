const { z } = require("zod");

const addAcademicYearSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "اسم السنة الدراسية مطلوب (مثل 2025/2026)",
    }).min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(20, "الاسم يجب ألا يتجاوز 20 حرف"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  }, {
    message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    path: ["startDate"],
  })
});

const updateAcademicYearSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "معرف السنة يجب أن يكون رقماً"),
  }),
  body: z.object({
    name: z.string().min(3).max(20).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  }, {
    message: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    path: ["startDate"],
  })
});

const setCurrentAcademicYearSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "معرف السنة يجب أن يكون رقماً"),
  })
});

module.exports = {
  addAcademicYearSchema,
  updateAcademicYearSchema,
  setCurrentAcademicYearSchema
};
