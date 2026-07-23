const express = require("express");
const router = express.Router();

const staffRoutes = require("./StaffRoutes");
const academicYearRoutes = require("./AcademicYearRoutes");
const schoolClassRoutes = require("./SchoolClassRoutes");

router.use("/staff", staffRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/classes", schoolClassRoutes);

module.exports = router;
