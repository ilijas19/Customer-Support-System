const express = require("express");
const router = express.Router();

const {
  authorizePermission,
  authenticateUser,
} = require("../middlewares/authentication");

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

// api/v1/admin

router.get(
  "/users",
  authenticateUser,
  authorizePermission("admin"),
  getAllUsers
);

router
  .route("/users/:id")
  .get(authenticateUser, authorizePermission("admin"), getSingleUser)
  .patch(authenticateUser, authorizePermission("admin"), updateUser)
  .delete(authenticateUser, authorizePermission("admin"), deleteUser);

module.exports = router;
