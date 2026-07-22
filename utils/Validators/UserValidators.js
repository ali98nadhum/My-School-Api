const { z } = require("zod");

// تحقق من صحة رقم الهاتف العراقي
const phoneRegex = /^(?:\+964|0)?7[0-9]{9}$/;

const createPrincipalSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "البريد الإلكتروني مطلوب" }).email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string({ required_error: "كلمة المرور مطلوبة" }).min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
    phone: z.string().regex(phoneRegex, "رقم الهاتف غير صالح").optional().nullable(),
    schoolId: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().optional(),
    isEmailVerified: z.boolean().optional().nullable(),
    
    // بيانات الملف الشخصي (StaffMember)
    firstNameAr: z.string({ required_error: "الاسم الأول (عربي) مطلوب" }).min(2),
    lastNameAr: z.string({ required_error: "الاسم الأخير (عربي) مطلوب" }).min(2),
    firstNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),
  })
});

const updatePrincipalSchema = z.object({
  body: z.object({
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح").optional().nullable(),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف").optional().nullable(),
    phone: z.string().regex(phoneRegex, "رقم الهاتف غير صالح").optional().nullable(),
    schoolId: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().optional().nullable(),
    isEmailVerified: z.boolean().optional().nullable(),
    
    // بيانات الملف الشخصي (StaffMember)
    firstNameAr: z.string().min(2).optional().nullable(),
    lastNameAr: z.string().min(2).optional().nullable(),
    firstNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),
  })
});

module.exports = {
  createPrincipalSchema,
  updatePrincipalSchema
};
