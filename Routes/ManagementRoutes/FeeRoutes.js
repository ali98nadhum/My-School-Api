const express = require("express");
const router = express.Router();
const {
  createFeeType,
  getFeeTypes,
  updateFeeType,
  deleteFeeType,
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure
} = require("../../Controllers/Management/FeeControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createFeeTypeSchema,
  updateFeeTypeSchema,
  createFeeStructureSchema,
  updateFeeStructureSchema
} = require("../../utils/Validators/FeeValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

// Fee Types Routes
router.post("/types", validate(createFeeTypeSchema), createFeeType);
router.get("/types", getFeeTypes);
router.put("/types/:id", validate(updateFeeTypeSchema), updateFeeType);
router.delete("/types/:id", deleteFeeType);

// Fee Structure Routes
router.post("/structure", validate(createFeeStructureSchema), createFeeStructure);
router.get("/structure", getFeeStructures);
router.put("/structure/:id", validate(updateFeeStructureSchema), updateFeeStructure);
router.delete("/structure/:id", deleteFeeStructure);

module.exports = router;
