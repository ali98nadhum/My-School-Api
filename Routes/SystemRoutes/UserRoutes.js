const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createPrincipal,
  updatePrincipal,
  deletePrincipal
} = require("../../Controllers/System/UserControllers");
const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const { createPrincipalSchema, updatePrincipalSchema } = require("../../utils/Validators/UserValidators");

router.use(protect);
router.use(allowedTo("SUPER_ADMIN"));

router.route("/")
  .get(getUsers);

router.post("/principal", validate(createPrincipalSchema), createPrincipal);

router.route("/:id")
  .get(getUserById);

router.route("/principal/:id")
  .put(validate(updatePrincipalSchema), updatePrincipal)
  .delete(deletePrincipal);

module.exports = router;
