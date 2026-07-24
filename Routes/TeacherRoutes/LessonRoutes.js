const express = require("express");
const router = express.Router();

const {
    createLesson,
    updateLesson,
    deleteLesson,
    getSectionLessons
} = require("../../Controllers/Teacher/LessonControllers");

const {
    createLessonSchema,
    updateLessonSchema
} = require("../../utils/Validators/LessonValidators");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const { uploadLessonMedia } = require("../../Middlewares/uploadMiddleware");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");

router.use(protect);
router.use(allowedTo("TEACHER"));

router.route("/")
    .post(
        uploadLessonMedia,
        validate(createLessonSchema),
        createLesson
    );

router.route("/:id")
    .put(
        uploadLessonMedia,
        validate(updateLessonSchema),
        updateLesson
    )
    .delete(deleteLesson);

router.route("/sections/:sectionId")
    .get(getSectionLessons);

module.exports = router;
