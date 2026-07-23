const express = require("express");
const router = express.Router();
const {
    createSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
} = require("../../Controllers/System/SchoolControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const { schoolSchema } = require("../../utils/Validators/SchoolVaildators");

router.use(protect);
router.use(allowedTo("SUPER_ADMIN"));


router.route("/")
    .post(validate(schoolSchema), createSchool)
    .get(getSchools);


router.route("/:id")
    .get(getSchoolById)
    .put(validate(schoolSchema), updateSchool)
    .delete(deleteSchool);

module.exports = router;
