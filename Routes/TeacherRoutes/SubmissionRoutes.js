const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { gradeSubmission } = require("../../Controllers/Teacher/SubmissionControllers");
const { validateGradeSubmission } = require("../../utils/Validators/SubmissionValidators");

const router = express.Router();

router.use(protect);
router.use(allowedTo("TEACHER"));

router.put("/:submissionId/grade", validateGradeSubmission, gradeSubmission);

module.exports = router;
