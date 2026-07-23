const { z } = require("zod");

const createSectionSchema = z.object({
  body: z.object({
    classId: z.number({
      required_error: "معرف الصف الدراسي مطلوب",
    }).int().positive(),
    name: z.string({
      required_error: "اسم الشعبة مطلوب (مثلاً: أ، ب، A، B)",
    }).min(1).max(10),
    capacity: z.number().int().positive().optional().default(30),
    homeroomTeacherId: z.number().int().positive().optional(),
  })
});

const updateSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    name: z.string().min(1).max(10).optional(),
    capacity: z.number().int().positive().optional(),
    homeroomTeacherId: z.number().int().positive().optional().nullable(),
  })
});

const getSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createSectionSchema,
  updateSectionSchema,
  getSectionSchema
};
