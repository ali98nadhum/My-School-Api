const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { getStudentHomeworks } = require("../../Controllers/Students/HomeworkControllers");
const { submitHomework, getMySubmission } = require("../../Controllers/Students/SubmissionControllers");
const { validateGetHomeworks } = require("../../utils/Validators/HomeworkValidators");
const { validateSubmitHomework, validateGetMySubmission } = require("../../utils/Validators/SubmissionValidators");
const { uploadHomeworkMedia } = require("../../Middlewares/uploadMiddleware");

const router = express.Router();

router.use(protect);
router.use(allowedTo("STUDENT"));

router.get("/", validateGetHomeworks, getStudentHomeworks);
router.post("/:homeworkId/submissions", uploadHomeworkMedia, validateSubmitHomework, submitHomework);
router.get("/:homeworkId/submissions", validateGetMySubmission, getMySubmission);

module.exports = router;
