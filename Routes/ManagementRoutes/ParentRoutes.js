const express = require("express");
const router = express.Router();
const {
  getParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
  linkStudent,
  unlinkStudent
} = require("../../Controllers/Management/ParentControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createParentSchema,
  updateParentSchema,
  getParentSchema,
  linkStudentSchema
} = require("../../utils/Validators/ParentValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getParents);
router.get("/:id", validate(getParentSchema), getParentById);
router.post("/", validate(createParentSchema), createParent);
router.put("/:id", validate(updateParentSchema), updateParent);

router.post("/:id/students", validate(linkStudentSchema), linkStudent);
router.delete("/:id/students/:studentId", validate(getParentSchema), unlinkStudent);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getParentSchema), deleteParent);

module.exports = router;
