const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  operatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
