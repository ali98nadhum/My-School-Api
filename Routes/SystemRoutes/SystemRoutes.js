const express = require("express");
const router = express.Router();

const schoolRoutes = require("./SchoolRoutes");
const userRoutes = require("./UserRoutes");

router.use("/schools", schoolRoutes);
router.use("/users", userRoutes);

module.exports = router;
