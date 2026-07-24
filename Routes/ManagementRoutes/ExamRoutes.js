const express = require("express");
const router = express.Router();
const {
  createExamType,
  getExamTypes,
  updateExamType,
  createExam,
  getExams
} = require("../../Controllers/Management/ExamControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createExamTypeSchema,
  updateExamTypeSchema,
  createExamSchema
} = require("../../utils/Validators/ExamValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

// Exam Types
router.post("/types", validate(createExamTypeSchema), createExamType);
router.get("/types", getExamTypes);
router.put("/types/:id", validate(updateExamTypeSchema), updateExamType);

// Exams
router.post("/", validate(createExamSchema), createExam);
router.get("/", getExams);

module.exports = router;
