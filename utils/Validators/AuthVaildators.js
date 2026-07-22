const { z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "البريد الإلكتروني مطلوب" }).email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
    password: z.string({ required_error: "كلمة المرور مطلوبة" }).min(6, { message: "كلمة المرور يجب أن لا تقل عن 6 أحرف" })
  })
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "يرجى إرسال رمز التجديد (refreshToken)" })
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "كلمة المرور القديمة مطلوبة" }).min(1, { message: "يرجى إدخال كلمة المرور القديمة" }),
    newPassword: z.string({ required_error: "كلمة المرور الجديدة مطلوبة" }).min(6, { message: "كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف" })
  })
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
};
