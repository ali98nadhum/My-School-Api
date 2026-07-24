const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { gradeSubmission, deleteSubmissionAttachment } = require("../../Controllers/Teacher/SubmissionControllers");
const { validateGradeSubmission } = require("../../utils/Validators/SubmissionValidators");

const router = express.Router();

router.use(protect);
router.use(allowedTo("TEACHER"));

router.put("/:submissionId/grade", validateGradeSubmission, gradeSubmission);
router.delete("/:submissionId/attachment", deleteSubmissionAttachment);

module.exports = router;
