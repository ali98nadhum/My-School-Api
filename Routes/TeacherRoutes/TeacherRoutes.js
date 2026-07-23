const express = require("express");
const router = express.Router();

const teacherTimetableRoutes = require("./TeacherTimetableRoutes");

router.use("/timetable", teacherTimetableRoutes);

module.exports = router;
