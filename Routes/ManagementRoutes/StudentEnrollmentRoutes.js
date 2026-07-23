const express = require("express");
const router = express.Router();
const {
  getEnrollments,
  getEnrollmentById,
  enrollStudent,
  assignStudentSection,
  transferStudentSection,
  removeStudentFromSection,
  updateEnrollmentStatus
} = require("../../Controllers/Management/StudentEnrollmentControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  enrollStudentSchema,
  assignSectionSchema,
  transferSectionSchema,
  updateStatusSchema,
  removeSectionSchema,
  getEnrollmentSchema
} = require("../../utils/Validators/StudentEnrollmentValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getEnrollments);
router.get("/:id", validate(getEnrollmentSchema), getEnrollmentById);
router.post("/", validate(enrollStudentSchema), enrollStudent);
router.put("/:id/assign-section", validate(assignSectionSchema), assignStudentSection);
router.put("/:id/transfer", validate(transferSectionSchema), transferStudentSection);
router.put("/:id/remove-section", validate(removeSectionSchema), removeStudentFromSection);
router.put("/:id/status", validate(updateStatusSchema), updateEnrollmentStatus);

module.exports = router;
