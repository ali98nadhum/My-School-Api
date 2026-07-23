const express = require("express");
const router = express.Router();
const {
  getGradeLevels,
  getGradeLevelById,
  createGradeLevel,
  updateGradeLevel,
  deleteGradeLevel
} = require("../../Controllers/System/GradeLevelControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createGradeLevelSchema,
  updateGradeLevelSchema,
  getGradeLevelSchema
} = require("../../utils/Validators/GradeLevelValidators");

router.use(protect);

router.get("/", allowedTo("SUPER_ADMIN", "PRINCIPAL", "ADMINISTRATOR"), getGradeLevels);
router.get("/:id", allowedTo("SUPER_ADMIN", "PRINCIPAL", "ADMINISTRATOR"), validate(getGradeLevelSchema), getGradeLevelById);

router.use(allowedTo("SUPER_ADMIN"));

router.post("/", validate(createGradeLevelSchema), createGradeLevel);
router.put("/:id", validate(updateGradeLevelSchema), updateGradeLevel);
router.delete("/:id", validate(getGradeLevelSchema), deleteGradeLevel);

module.exports = router;
