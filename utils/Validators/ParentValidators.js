const { z } = require("zod");

const phoneRegex = /^(?:\+964|0)?7[0-9]{9}$/;

const createParentSchema = z.object({
  body: z.object({
    email: z.string().email("يجب إدخال بريد إلكتروني صحيح").optional().nullable(),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
    phonePrimary: z.string().regex(phoneRegex, "رقم الهاتف الأساسي غير صالح"),
    phoneSecondary: z.string().regex(phoneRegex, "رقم الهاتف البديل غير صالح").optional().nullable(),
    firstNameAr: z.string({ required_error: "الاسم الأول بالعربي مطلوب" }).min(2),
    lastNameAr: z.string({ required_error: "الاسم الثاني بالعربي مطلوب" }).min(2),
    firstNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),
    nationalId: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
  })
});

const updateParentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    email: z.string().email("بريد إلكتروني غير صحيح").optional(),
    password: z.string().min(6).optional(),
    phonePrimary: z.string().regex(phoneRegex, "رقم الهاتف الأساسي غير صالح").optional().nullable(),
    phoneSecondary: z.string().regex(phoneRegex, "رقم الهاتف البديل غير صالح").optional().nullable(),
    firstNameAr: z.string().min(2).optional().nullable(),
    lastNameAr: z.string().min(2).optional().nullable(),
    firstNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),
    nationalId: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  })
});

const linkStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    studentId: z.number().int().positive("معرف الطالب مطلوب"),
    relationshipType: z.enum(["FATHER", "MOTHER", "GRANDFATHER", "GRANDMOTHER", "UNCLE", "AUNT", "BROTHER", "SISTER", "OTHER"]).optional(),
    isPrimaryContact: z.boolean().optional().default(true),
    canPickup: z.boolean().optional().default(true),
    financialResponsible: z.boolean().optional().default(true)
  })
});

const getParentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createParentSchema,
  updateParentSchema,
  linkStudentSchema,
  getParentSchema
};
