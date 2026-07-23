const express = require("express");
const router = express.Router();

const staffRoutes = require("./StaffRoutes");
const academicYearRoutes = require("./AcademicYearRoutes");
const schoolClassRoutes = require("./SchoolClassRoutes");
const sectionRoutes = require("./SectionRoutes");
const subjectRoutes = require("./SubjectRoutes");
const teacherRoutes = require("./TeacherRoutes");

router.use("/staff", staffRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/classes", schoolClassRoutes);
router.use("/sections", sectionRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teachers", teacherRoutes);

module.exports = router;
