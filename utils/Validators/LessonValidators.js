const { z } = require("zod");

// ============================================================
// Validators for Lessons
// ============================================================

const createLessonSchema = z.object({
    body: z.object({
        sectionIds: z.preprocess((val) => {
            if (typeof val === 'string') {
                return val.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
            }
            if (Array.isArray(val)) {
                return val.map(v => parseInt(v, 10)).filter(n => !isNaN(n));
            }
            return [];
        }, z.array(z.number().int().positive()).min(1, "يجب تحديد شعبة واحدة على الأقل")),
        subjectId: z.coerce.number({ required_error: "معرف المادة مطلوب" })
            .int("يجب أن يكون رقم صحيح")
            .positive("يجب أن يكون رقم موجب"),
        title: z.string({ required_error: "عنوان الدرس مطلوب" })
            .min(3, "يجب أن يكون 3 حروف على الأقل")
            .max(200, "يجب أن لا يتجاوز 200 حرف"),
        description: z.string().optional(),
        lessonDate: z.coerce.date().optional(),
        youtubeUrl: z.string().url("رابط اليوتيوب غير صالح").optional().or(z.literal("")),
    })
});

const updateLessonSchema = z.object({
    body: z.object({
        title: z.string()
            .min(3, "يجب أن يكون 3 حروف على الأقل")
            .max(200, "يجب أن لا يتجاوز 200 حرف").optional(),
        description: z.string().optional(),
        lessonDate: z.coerce.date().optional(),
        youtubeUrl: z.string().url("رابط اليوتيوب غير صالح").optional().or(z.literal("")),
    })
});

module.exports = {
    createLessonSchema,
    updateLessonSchema
};
