const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../../Controllers/Management/StudentControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createStudentSchema,
  updateStudentSchema,
  getStudentSchema
} = require("../../utils/Validators/StudentValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getStudents);
router.get("/:id", validate(getStudentSchema), getStudentById);
router.post("/", validate(createStudentSchema), createStudent);
router.put("/:id", validate(updateStudentSchema), updateStudent);

router.delete("/:id", allowedTo("PRINCIPAL"), validate(getStudentSchema), deleteStudent);

module.exports = router;
