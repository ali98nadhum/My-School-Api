const express = require("express");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const {
    createHomework,
    updateHomework,
    deleteHomework,
    getTeacherHomeworks
} = require("../../Controllers/Teacher/HomeworkControllers");
const { uploadHomeworkMedia } = require("../../Middlewares/uploadMiddleware");
const {
    validateCreateHomework,
    validateUpdateHomework,
    validateGetHomeworks,
    validateHomeworkId
} = require("../../utils/Validators/HomeworkValidators");

const router = express.Router();

// All routes are protected and restricted to TEACHER
router.use(protect);
router.use(allowedTo("TEACHER"));

router.route("/")
    .post(uploadHomeworkMedia, validateCreateHomework, createHomework)
    .get(validateGetHomeworks, getTeacherHomeworks);

router.route("/:id")
    .put(validateUpdateHomework, updateHomework)
    .delete(validateHomeworkId, deleteHomework);

module.exports = router;
