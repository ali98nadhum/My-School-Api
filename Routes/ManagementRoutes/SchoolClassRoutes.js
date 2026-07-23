const express = require("express");
const router = express.Router();
const {
  getSchoolClasses,
  getSchoolClassById,
  createSchoolClass,
  updateSchoolClass,
  deleteSchoolClass
} = require("../../Controllers/Management/SchoolClassControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createSchoolClassSchema,
  updateSchoolClassSchema,
  getSchoolClassSchema
} = require("../../utils/Validators/SchoolClassValidators");

router.use(protect);


router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getSchoolClasses);
router.get("/:id", validate(getSchoolClassSchema), getSchoolClassById);
router.post("/", validate(createSchoolClassSchema), createSchoolClass);
router.put("/:id", validate(updateSchoolClassSchema), updateSchoolClass);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getSchoolClassSchema), deleteSchoolClass);

module.exports = router;
