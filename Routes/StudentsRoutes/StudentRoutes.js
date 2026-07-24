const express = require("express");
const router = express.Router();

const homeworkRoutes = require("./HomeworkRoutes");

router.use("/homeworks", homeworkRoutes);

module.exports = router;
