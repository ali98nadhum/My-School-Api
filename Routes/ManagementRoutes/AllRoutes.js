const express = require("express");
const router = express.Router();

const schoolRoutes = require("./SchoolRoutes");

// ربط جميع مسارات إدارة المدارس
router.use("/schools", schoolRoutes);

module.exports = router;