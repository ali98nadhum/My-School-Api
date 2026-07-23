const express = require("express");
const {
  login,
  refreshToken,
  logout,
  changePassword,
} = require("../../Controllers/Auth/AuthControllers");
const { protect } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const { loginSchema, refreshTokenSchema, changePasswordSchema } = require("../../utils/Validators/AuthVaildators");

const router = express.Router();


router.post("/login", validate(loginSchema), login);

router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

router.post("/logout", protect, validate(refreshTokenSchema), logout);

router.post("/change-password", protect, validate(changePasswordSchema), changePassword);

module.exports = router;
