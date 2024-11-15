const express = require("express");
const router = express.Router();

const {
  authorizePermission,
  authenticateUser,
} = require("../middlewares/authentication");

const {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  showMe,
  logout,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/verifyEmail", verifyEmail);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/showMe", authenticateUser, showMe);
router.delete("/logout", authenticateUser, logout);

module.exports = router;
