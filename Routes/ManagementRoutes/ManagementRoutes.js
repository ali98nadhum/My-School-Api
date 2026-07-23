const express = require("express");
const router = express.Router();

const staffRoutes = require("./StaffRoutes");
const academicYearRoutes = require("./AcademicYearRoutes");

router.use("/staff", staffRoutes);
router.use("/academic-years", academicYearRoutes);

module.exports = router;
