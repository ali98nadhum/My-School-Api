const express = require("express");
const router = express.Router();

const teacherTimetableRoutes = require("./TeacherTimetableRoutes");
const lessonRoutes = require("./LessonRoutes");

router.use("/timetable", teacherTimetableRoutes);
router.use("/lessons", lessonRoutes);

module.exports = router;
