const { z } = require("zod");

const createTeacherSchema = z.object({
  body: z.object({
    email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
    phone: z.string().optional(),
    firstNameAr: z.string({ required_error: "الاسم الأول بالعربي مطلوب" }).min(2),
    lastNameAr: z.string({ required_error: "الاسم الثاني بالعربي مطلوب" }).min(2),
    firstNameEn: z.string().optional(),
    lastNameEn: z.string().optional(),
    qualification: z.string().optional(),
    specialization: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  })
});

const updateTeacherSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    email: z.string().email("بريد إلكتروني غير صحيح").optional(),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
    firstNameAr: z.string().min(2).optional(),
    lastNameAr: z.string().min(2).optional(),
    firstNameEn: z.string().optional(),
    lastNameEn: z.string().optional(),
    qualification: z.string().optional(),
    specialization: z.string().optional(),
    isActive: z.boolean().optional(),
  })
});

const assignTeacherSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    sectionId: z.number().int().positive("معرف الشعبة مطلوب"),
    subjectId: z.number().int().positive("معرف المادة مطلوب"),
    academicYearId: z.number().int().positive("معرف السنة الدراسية مطلوب"),
  })
});

const getTeacherSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
  assignTeacherSchema,
  getTeacherSchema
};
