const { z } = require("zod");
const { validate } = require("./validatorMiddleware");

const syncBiometricSchema = z.object({
    body: z.object({
        code: z.string({ required_error: "كود المستخدم (code) مطلوب" }).min(1, "لا يمكن أن يكون الكود فارغاً"),
        timestamp: z.string({ required_error: "وقت البصمة (timestamp) مطلوب" }).refine(val => !isNaN(Date.parse(val)), {
            message: "صيغة التاريخ والوقت غير صحيحة"
        })
    })
});

const getDailyAttendanceReportSchema = z.object({
    query: z.object({
        date: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
            message: "صيغة التاريخ غير صحيحة"
        }),
        userType: z.enum(["STUDENT", "TEACHER", "STAFF", "PRINCIPAL", "SUPER_ADMIN"]).optional(),
    })
});

module.exports = {
    validateSyncBiometric: validate(syncBiometricSchema),
    validateGetDailyAttendanceReport: validate(getDailyAttendanceReportSchema)
};
