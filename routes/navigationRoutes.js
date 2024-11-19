const express = require("express");
const router = express.Router();
const path = require("path");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.use(express.static(path.join(__dirname, "../public")));

router.get("/userChat", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/userPage.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.get(
  "/operator",
  authenticateUser,
  authorizePermission("operator"),
  (req, res) => {
    res.sendFile(path.join(__dirname, "../public/operatorPage.html"));
  }
);
module.exports = router;
