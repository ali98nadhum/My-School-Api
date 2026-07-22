const express = require("express");
const router = express.Router();

const schoolRoutes = require("./SchoolRoutes");

router.use("/schools", schoolRoutes);

module.exports = router;