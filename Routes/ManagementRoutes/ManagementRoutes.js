const express = require("express");
const router = express.Router();

const staffRoutes = require("./StaffRoutes");
const academicYearRoutes = require("./AcademicYearRoutes");
const schoolClassRoutes = require("./SchoolClassRoutes");
const sectionRoutes = require("./SectionRoutes");
const subjectRoutes = require("./SubjectRoutes");
const teacherRoutes = require("./TeacherRoutes");
const parentRoutes = require("./ParentRoutes");
const studentRoutes = require("./StudentRoutes");
const studentEnrollmentRoutes = require("./StudentEnrollmentRoutes");
const TimetableRoute = require("./TimetableRoutes");

router.use("/staff", staffRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/classes", schoolClassRoutes);
router.use("/sections", sectionRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teachers", teacherRoutes);
router.use("/parents", parentRoutes);
router.use("/students", studentRoutes);
router.use("/enrollments", studentEnrollmentRoutes);
router.use("/timetables", TimetableRoute);

module.exports = router;
