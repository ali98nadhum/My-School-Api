const express = require("express");
const router = express.Router();
const {
  getStaff,
  addAdministrator,
  addAccountant,
  addTeacher,
  updateStaff,
  deleteStaff,
} = require("../../Controllers/Management/StaffControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { checkPermission } = require("../../utils/Auth/permission");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  addAdministratorSchema,
  addAccountantSchema,
  addTeacherSchema,
  updateStaffSchema
} = require("../../utils/Validators/StaffValidators");

router.use(protect);

router.get("/", allowedTo("PRINCIPAL", "ADMINISTRATOR", "ACCOUNTANT"), getStaff);

router.post("/admin", allowedTo("PRINCIPAL"), validate(addAdministratorSchema), addAdministrator);
router.post("/accountant", allowedTo("PRINCIPAL"), validate(addAccountantSchema), addAccountant);

router.post("/teacher", allowedTo("PRINCIPAL", "ADMINISTRATOR"), validate(addTeacherSchema), addTeacher);

router.put("/:id", allowedTo("PRINCIPAL", "ADMINISTRATOR"), validate(updateStaffSchema), updateStaff);

router.delete("/:id", allowedTo("PRINCIPAL"), deleteStaff);

module.exports = router;
