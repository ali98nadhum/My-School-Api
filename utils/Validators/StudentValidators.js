const { z } = require("zod");

const createStudentSchema = z.object({
  body: z.object({
    email: z.string().email("بريد إلكتروني غير صحيح").optional().nullable(),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف").optional().nullable(),

    studentCode: z.string().min(2, "الكود المدرسي مطلوب").optional(),
    firstNameAr: z.string({ required_error: "الاسم الأول بالعربي مطلوب" }).min(2),
    middleNameAr: z.string().optional().nullable(),
    lastNameAr: z.string({ required_error: "الاسم الأخير بالعربي مطلوب" }).min(2),
    firstNameEn: z.string().optional().nullable(),
    middleNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),

    gender: z.enum(["MALE", "FEMALE"], { required_error: "الجنس مطلوب" }),
    dateOfBirth: z.string().optional().nullable(), // ISO date string
    nationalId: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    enrollmentDate: z.string().optional().nullable(),
    currentSectionId: z.number().int().positive().optional().nullable(),
    status: z.enum(["ACTIVE", "TRANSFERRED", "WITHDRAWN", "GRADUATED", "SUSPENDED"]).optional().default("ACTIVE"),
    bloodType: z.string().max(5).optional().nullable(),
    address: z.string().optional().nullable(),

    parentIds: z.array(z.number().int().positive())
      .min(1, "يجب ربط الطالب بولي أمر واحد على الأقل")
      .max(4, "لا يمكن ربط الطالب بأكثر من 4 أولياء أمور")
  })
});

const updateStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    email: z.string().email("بريد إلكتروني غير صحيح").optional().nullable(),
    password: z.string().min(6).optional().nullable(),

    studentCode: z.string().min(2).optional(),
    firstNameAr: z.string().min(2).optional(),
    middleNameAr: z.string().optional().nullable(),
    lastNameAr: z.string().min(2).optional(),
    firstNameEn: z.string().optional().nullable(),
    middleNameEn: z.string().optional().nullable(),
    lastNameEn: z.string().optional().nullable(),

    gender: z.enum(["MALE", "FEMALE"]).optional(),
    dateOfBirth: z.string().optional().nullable(),
    nationalId: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    enrollmentDate: z.string().optional().nullable(),
    currentSectionId: z.number().int().positive().optional().nullable(),
    status: z.enum(["ACTIVE", "TRANSFERRED", "WITHDRAWN", "GRADUATED", "SUSPENDED"]).optional(),
    bloodType: z.string().max(5).optional().nullable(),
    address: z.string().optional().nullable(),

    parentIds: z.array(z.number().int().positive())
      .min(1, "يجب أن يبقى للطالب ولي أمر واحد على الأقل")
      .max(4, "لا يمكن ربط الطالب بأكثر من 4 أولياء أمور")
      .optional()
  })
});

const getStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  getStudentSchema
};
