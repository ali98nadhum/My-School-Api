const { z } = require("zod");

const enrollStudentSchema = z.object({
  body: z.object({
    studentId: z.number().int().positive("معرف الطالب مطلوب ويجب أن يكون رقماً صحيحاً"),
    classId: z.number().int().positive("معرف الصف الدراسي مطلوب"),
    sectionId: z.number().int().positive("معرف الشعبة يجب أن يكون رقماً").optional().nullable(),
    enrollmentDate: z.string().optional(),
    status: z.enum(["ACTIVE", "TRANSFERRED", "WITHDRAWN", "GRADUATED", "SUSPENDED"]).optional().default("ACTIVE"),
  })
});

const assignSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    sectionId: z.number().int().positive("معرف الشعبة مطلوب")
  })
});

const transferSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    newSectionId: z.number().int().positive("معرف الشعبة الجديدة مطلوب")
  })
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    status: z.enum(["ACTIVE", "TRANSFERRED", "WITHDRAWN", "GRADUATED", "SUSPENDED"], { required_error: "حالة التسجيل مطلوبة" })
  })
});

const removeSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

const getEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  enrollStudentSchema,
  assignSectionSchema,
  transferSectionSchema,
  updateStatusSchema,
  removeSectionSchema,
  getEnrollmentSchema
};
