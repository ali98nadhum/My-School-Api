const express = require("express");
const router = express.Router();
const {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  setCurrentAcademicYear
} = require("../../Controllers/Management/AcademicYearControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  addAcademicYearSchema,
  updateAcademicYearSchema,
  setCurrentAcademicYearSchema
} = require("../../utils/Validators/AcademicYearValidators");

router.use(protect);

router.get("/", allowedTo("PRINCIPAL", "ADMINISTRATOR"), getAcademicYears);

router.use(allowedTo("PRINCIPAL"));

router.post("/", validate(addAcademicYearSchema), createAcademicYear);
router.put("/:id", validate(updateAcademicYearSchema), updateAcademicYear);
router.delete("/:id", deleteAcademicYear);
router.patch("/:id/set-current", validate(setCurrentAcademicYearSchema), setCurrentAcademicYear);

module.exports = router;
