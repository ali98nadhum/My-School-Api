const express = require("express");
const router = express.Router();
const {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection
} = require("../../Controllers/Management/SectionControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createSectionSchema,
  updateSectionSchema,
  getSectionSchema
} = require("../../utils/Validators/SectionValidators");

router.use(protect);

router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getSections);
router.get("/:id", validate(getSectionSchema), getSectionById);
router.post("/", validate(createSectionSchema), createSection);
router.put("/:id", validate(updateSectionSchema), updateSection);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getSectionSchema), deleteSection);

module.exports = router;
