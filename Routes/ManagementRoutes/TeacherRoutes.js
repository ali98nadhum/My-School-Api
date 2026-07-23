const express = require("express");
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignTeacher
} = require("../../Controllers/Management/TeacherControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createTeacherSchema,
  updateTeacherSchema,
  getTeacherSchema,
  assignTeacherSchema
} = require("../../utils/Validators/TeacherValidators");

router.use(protect);

router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getTeachers);
router.get("/:id", validate(getTeacherSchema), getTeacherById);
router.post("/", validate(createTeacherSchema), createTeacher);
router.put("/:id", validate(updateTeacherSchema), updateTeacher);

router.post("/:id/assignments", validate(assignTeacherSchema), assignTeacher);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getTeacherSchema), deleteTeacher);

module.exports = router;
