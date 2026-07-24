const express = require("express");
const router = express.Router();

const teacherTimetableRoutes = require("./TeacherTimetableRoutes");
const lessonRoutes = require("./LessonRoutes");
const homeworkRoutes = require("./HomeworkRoutes");
const submissionRoutes = require("./SubmissionRoutes");

router.use("/timetable", teacherTimetableRoutes);
router.use("/lessons", lessonRoutes);
router.use("/homeworks", homeworkRoutes);
router.use("/submissions", submissionRoutes);

module.exports = router;
