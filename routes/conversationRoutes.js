const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  createConversation,
  getOperatorConversations,
  getConversationHistory,
  openConversation,
  closeConversation,
  deleteConversation,
  getUserConversation,
} = require("../controllers/conversationController");

router.post(
  "/",
  authenticateUser,
  authorizePermission("operator"),
  createConversation
);
router.get(
  "/operator/conversations",
  authenticateUser,
  authorizePermission("operator"),
  getOperatorConversations
);

router.get("/user/conversations", authenticateUser, getUserConversation);

router.patch(
  "/:id/open",
  authenticateUser,
  authorizePermission("operator"),
  openConversation
);

router.patch("/:id/close", authenticateUser, closeConversation);

router
  .route("/:id")
  .get(
    authenticateUser,
    authorizePermission("operator"),
    getConversationHistory
  )
  .delete(
    authenticateUser,
    authorizePermission("operator"),
    deleteConversation
  );

module.exports = router;
