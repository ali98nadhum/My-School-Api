const { z } = require("zod");

// Exam Type Validators
const createExamTypeSchema = z.object({
  body: z.object({
    nameAr: z.string().min(2, "اسم نوع الامتحان بالعربية مطلوب"),
    nameEn: z.string().optional(),
    weightPercentage: z.number().min(0, "نسبة الامتحان يجب أن تكون 0 أو أكثر").max(100, "نسبة الامتحان لا يمكن أن تتجاوز 100").optional()
  })
});

const updateExamTypeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    nameAr: z.string().min(2, "اسم نوع الامتحان بالعربية مطلوب").optional(),
    nameEn: z.string().optional(),
    weightPercentage: z.number().min(0).max(100).optional()
  })
});

// Exam Validators
const createExamSchema = z.object({
  body: z.object({
    academicYearId: z.number().int().positive("معرف السنة الدراسية مطلوب"),
    examTypeId: z.number().int().positive("معرف نوع الامتحان مطلوب"),
    subjectId: z.number().int().positive("معرف المادة مطلوب"),
    sectionId: z.number().int().positive("معرف الشعبة مطلوب"),
    examDate: z.string().datetime({ message: "تاريخ الامتحان غير صالح" }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ غير صالحة")),
    maxScore: z.number().min(0, "الدرجة العظمى يجب أن تكون صفر أو أكثر").optional(),
    passingScore: z.number().min(0, "درجة النجاح يجب أن تكون صفر أو أكثر").optional()
  })
});

const updateExamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    examDate: z.string().datetime({ message: "تاريخ الامتحان غير صالح" }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ غير صالحة")).optional(),
    maxScore: z.number().min(0).optional(),
    passingScore: z.number().min(0).optional()
  })
});

const getExamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createExamTypeSchema,
  updateExamTypeSchema,
  createExamSchema,
  updateExamSchema,
  getExamSchema
};
