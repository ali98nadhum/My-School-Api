const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { getDailyAttendance } = require("../../Controllers/Management/AttendanceReportControllers");
const { validateGetDailyAttendanceReport } = require("../../utils/Validators/AttendanceValidators");

const router = express.Router();

router.use(protect);
router.use(allowedTo("PRINCIPAL", "SUPER_ADMIN"));

router.get("/daily", validateGetDailyAttendanceReport, getDailyAttendance);

module.exports = router;
