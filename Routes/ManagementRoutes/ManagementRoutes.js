const express = require("express");
const router = express.Router();

const staffRoutes = require("./StaffRoutes");

router.use("/staff", staffRoutes);

module.exports = router;
