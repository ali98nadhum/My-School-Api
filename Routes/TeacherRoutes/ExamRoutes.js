const express = require("express");
const router = express.Router();
const {
  createExam,
  getTeacherExams,
  updateExam,
  deleteExam
} = require("../../Controllers/Teacher/ExamControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createExamSchema,
  updateExamSchema,
  getExamSchema
} = require("../../utils/Validators/ExamValidators");

router.use(protect);
router.use(allowedTo("TEACHER"));

router.post("/", validate(createExamSchema), createExam);
router.get("/", getTeacherExams);
router.put("/:id", validate(updateExamSchema), updateExam);
router.delete("/:id", validate(getExamSchema), deleteExam);

module.exports = router;
