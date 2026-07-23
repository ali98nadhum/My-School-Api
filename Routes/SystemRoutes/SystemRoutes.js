const express = require("express");
const router = express.Router();

const schoolRoutes = require("./SchoolRoutes");
const userRoutes = require("./UserRoutes");
const gradeLevelRoutes = require("./GradeLevelRoutes");

router.use("/schools", schoolRoutes);
router.use("/users", userRoutes);
router.use("/grade-levels", gradeLevelRoutes);

module.exports = router;
