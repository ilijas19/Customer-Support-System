const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/authentication");

const {
  createTextMessage,
  createImgMessage,
  getRecentMessages,
  clearMessageHistory,
} = require("../controllers/messageController");

// api/v1/message

router.post("/text", createTextMessage);
router.post("/img", createImgMessage);
router.post("/recent", getRecentMessages);
router.get("/clear", clearMessageHistory);

module.exports = router;
