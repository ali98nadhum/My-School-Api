const express = require("express");
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../../Controllers/Management/SubjectControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema
} = require("../../utils/Validators/SubjectValidators");

router.use(protect);

router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getSubjects);
router.get("/:id", validate(getSubjectSchema), getSubjectById);
router.post("/", validate(createSubjectSchema), createSubject);
router.put("/:id", validate(updateSubjectSchema), updateSubject);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getSubjectSchema), deleteSubject);

module.exports = router;
