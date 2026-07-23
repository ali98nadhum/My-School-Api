const express = require("express");
const router = express.Router();

const { getMyTimetable } = require("../../Controllers/Teacher/TeacherTimetableControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");

// Protect all routes for TEACHER
router.use(protect);
router.use(allowedTo("TEACHER"));

router.get("/", getMyTimetable);

module.exports = router;
