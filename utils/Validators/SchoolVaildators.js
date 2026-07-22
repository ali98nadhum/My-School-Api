const { z } = require("zod");

const iraqiPhoneRegex = /^(?:\+964|0)?7[0-9]{9}$/;

const schoolSchema = z.object({
  body: z.object({
    nameAr: z.string().trim().optional(),
    nameEn: z.string().trim().optional(),
    address: z.string().optional(),
    phone: z.string()
      .regex(iraqiPhoneRegex, { message: "رقم الهاتف غير صالح. يرجى إدخال رقم عراقي صحيح (مثال: 07701234567)" })
      .optional()
  }).refine((data) => (data.nameAr && data.nameAr.length > 0) || (data.nameEn && data.nameEn.length > 0), {
    message: "يجب إدخال إما الاسم العربي أو الاسم الإنجليزي للمدرسة",
    path: ["nameAr"]
  })
});

module.exports = {
  schoolSchema,
};
