const { z } = require("zod");

const DayOfWeekEnum = z.enum(["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"], {
  required_error: "يوم الأسبوع مطلوب",
  invalid_type_error: "يوم الأسبوع غير صالح",
});

const timetableEntrySchema = z.object({
  sectionId: z.number({ required_error: "معرف الشعبة مطلوب" }).int().positive(),
  subjectId: z.number({ required_error: "معرف المادة مطلوب" }).int().positive(),
  teacherId: z.number({ required_error: "معرف المعلم مطلوب" }).int().positive(),
  periodId: z.number({ required_error: "معرف الحصة مطلوب" }).int().positive(),
  dayOfWeek: DayOfWeekEnum,
  room: z.string().max(30).optional().nullable(),
  academicYearId: z.number({ required_error: "معرف السنة الدراسية مطلوب" }).int().positive()
});

const createTimetableSchema = z.object({
  body: timetableEntrySchema
});

const batchCreateTimetableSchema = z.object({
  body: z.object({
    entries: z.array(timetableEntrySchema).min(1, "يجب إرسال حصة واحدة على الأقل")
  })
});

const updateTimetableSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  }),
  body: z.object({
    subjectId: z.number().int().positive("معرف المادة مطلوب").optional(),
    teacherId: z.number().int().positive("معرف المعلم مطلوب").optional(),
    periodId: z.number().int().positive("معرف الحصة مطلوب").optional(),
    dayOfWeek: DayOfWeekEnum.optional(),
    room: z.string().max(30).optional().nullable()
  }).refine(data => Object.keys(data).length > 0, {
    message: "يجب توفير حقل واحد على الأقل للتحديث"
  })
});

const deleteTimetableSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

const getTimetableSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "المعرف يجب أن يكون رقماً"),
  })
});

module.exports = {
  createTimetableSchema,
  batchCreateTimetableSchema,
  updateTimetableSchema,
  deleteTimetableSchema,
  getTimetableSchema
};
