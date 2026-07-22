const express = require("express");
const router = express.Router();
const {
    createSchool,
    getSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
} = require("../../Controllers/Management/SchoolControllers");
const { protect } = require("../../utils/Auth/AuthService");
const { checkPermission } = require("../../utils/Auth/permission");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const { schoolSchema } = require("../../utils/Validators/SchoolVaildators");

router.use(protect);

router.route("/")
    .post(checkPermission("CREATE_SCHOOL"), validate(schoolSchema), createSchool)
    .get(checkPermission("VIEW_SCHOOLS"), getSchools);

router.route("/:id")
    .get(checkPermission("VIEW_SCHOOL_DETAILS"), getSchoolById)
    .put(checkPermission("UPDATE_SCHOOL"), validate(schoolSchema), updateSchool)
    .delete(checkPermission("DELETE_SCHOOL"), deleteSchool);

module.exports = router;
