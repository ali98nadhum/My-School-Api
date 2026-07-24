const { z } = require("zod");
const { validate } = require("./validatorMiddleware");

const createHomeworkSchema = z.object({
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
        lessonId: z.coerce.number().int().positive().optional(),
        title: z.string({ required_error: "العنوان مطلوب" })
            .min(3, "العنوان يجب أن يكون 3 أحرف على الأقل")
            .max(200, "العنوان يجب ألا يتجاوز 200 حرف"),
        description: z.string().optional(),
        dueDate: z.string().optional().refine(val => {
            if (!val) return true;
            return !isNaN(Date.parse(val));
        }, { message: "تاريخ غير صالح" })
    })
});

const updateHomeworkSchema = z.object({
    params: z.object({
        id: z.coerce.number({ required_error: "معرف الواجب مطلوب" }).int().positive()
    }),
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        description: z.string().optional(),
        dueDate: z.string().optional().refine(val => {
            if (!val) return true;
            return !isNaN(Date.parse(val));
        }, { message: "تاريخ غير صالح" })
    })
});

const getHomeworksSchema = z.object({
    query: z.object({
        sectionId: z.coerce.number().int().positive().optional(),
        subjectId: z.coerce.number().int().positive().optional(),
    })
});

const homeworkIdSchema = z.object({
    params: z.object({
        id: z.coerce.number({ required_error: "معرف الواجب مطلوب" }).int().positive()
    })
});

module.exports = {
    validateCreateHomework: validate(createHomeworkSchema),
    validateUpdateHomework: validate(updateHomeworkSchema),
    validateGetHomeworks: validate(getHomeworksSchema),
    validateHomeworkId: validate(homeworkIdSchema),
};
