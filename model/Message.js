const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide sender username"],
  },
  senderUsername: {
    type: String,
    required: [true, "please provide sender username"],
  },
  text: {
    type: String,
    required: [true, "Message text cannot be empty"],
    maxLength: 1000,
  },
  type: {
    type: String,
    enum: ["text", "image"],
    default: "text",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
