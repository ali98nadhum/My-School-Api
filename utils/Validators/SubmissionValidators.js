const { z } = require("zod");
const { validate } = require("./validatorMiddleware");

const submitHomeworkSchema = z.object({
    params: z.object({
        homeworkId: z.coerce.number({ required_error: "معرف الواجب مطلوب" }).int().positive()
    })
});

const getMySubmissionSchema = z.object({
    params: z.object({
        homeworkId: z.coerce.number({ required_error: "معرف الواجب مطلوب" }).int().positive()
    })
});

const getHomeworkSubmissionsSchema = z.object({
    params: z.object({
        homeworkId: z.coerce.number({ required_error: "معرف الواجب مطلوب" }).int().positive()
    })
});

const gradeSubmissionSchema = z.object({
    params: z.object({
        submissionId: z.coerce.number({ required_error: "معرف التسليم مطلوب" }).int().positive()
    }),
    body: z.object({
        score: z.coerce.number({ required_error: "الدرجة مطلوبة" })
            .min(0, "لا يمكن أن تكون الدرجة أقل من صفر")
            .max(100, "لا يمكن أن تتجاوز الدرجة 100"), 
        feedback: z.string().max(1000, "الملاحظات طويلة جداً").optional()
    })
});

module.exports = {
    validateSubmitHomework: validate(submitHomeworkSchema),
    validateGetMySubmission: validate(getMySubmissionSchema),
    validateGetHomeworkSubmissions: validate(getHomeworkSubmissionsSchema),
    validateGradeSubmission: validate(gradeSubmissionSchema)
};
