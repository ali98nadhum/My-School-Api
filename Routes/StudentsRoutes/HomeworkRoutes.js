const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { getStudentHomeworks } = require("../../Controllers/Students/HomeworkControllers");
const { validateGetHomeworks } = require("../../utils/Validators/HomeworkValidators");

const router = express.Router();

router.use(protect);
router.use(allowedTo("STUDENT"));

router.get("/", validateGetHomeworks, getStudentHomeworks);

module.exports = router;
