const express = require("express");
const {
  login,
  refreshToken,
  logout,
  changePassword,
} = require("../../Controllers/Auth/AuthControllers");
const { protect } = require("../../utils/Auth/AuthService");

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);

module.exports = router;
