/**
 * @swagger
 * components:
 *   parameters:
 *     StudentIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الطالب
 *     TeacherIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف المعلم
 *     ParentIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف ولي الأمر
 *     ParentLinkedStudentIdParam:
 *       in: path
 *       name: studentId
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الطالب المرتبط بولي الأمر
 *     StaffIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الموظف (User ID)
 *     SchoolClassIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الصف
 *     SectionIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الشعبة
 *     SubjectIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف المادة
 *     AcademicYearIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف السنة الدراسية
 *     GradeLevelIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف المرحلة الدراسية
 *     EnrollmentIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف التسجيل (Enrollment ID)
 *     TimetableIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف سجل الجدول الزمني
 *     SchoolIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف المدرسة
 *     UserIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف المستخدم
 *     TeacherHomeworkIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الواجب
 *     LessonIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الدرس
 *     LessonSectionIdParam:
 *       in: path
 *       name: sectionId
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الشعبة
 *     HomeworkRefParam:
 *       in: path
 *       name: homeworkId
 *       required: true
 *       schema:
 *         type: integer
 *       description: رقم الواجب
 *     SubmissionIdParam:
 *       in: path
 *       name: submissionId
 *       required: true
 *       schema:
 *         type: integer
 *       description: رقم التسليم
 *     ExamTypeIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف نوع الامتحان
 *     ExamIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: معرف الامتحان
 */
