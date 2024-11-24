const Message = require("../model/Message");
const Conversation = require("../model/Conversation");
const User = require("../model/User");
const CustomErorr = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createTextMessage = async (req, res) => {
  const { conversationId, senderUsername, text } = req.body;
  if (!conversationId || !senderUsername || !text) {
    throw new CustomErorr.BadRequestError("All credientials must be proviided");
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  const sender = await User.findOne({ username: senderUsername });
  if (!conversation) {
    throw new CustomErorr.NotFoundError(
      `No conversation with id ${conversationId}`
    );
  }
  if (!sender) {
    throw new CustomErorr.NotFoundError(`No user with id: ${senderUsername}`);
  }

  console.log(sender._id.toString());
  console.log(conversation.operatorId.toString());
  if (
    sender._id.toString() !== conversation.userId.toString() &&
    sender._id.toString() !== conversation.operatorId.toString()
  ) {
    throw new CustomErorr.BadRequestError(
      `${senderUsername} does not participate in conversation with id: ${conversationId}`
    );
  }
  const message = await Message.create({
    conversationId,
    senderId: sender._id,
    senderUsername,
    text,
  });

  conversation.messages.push(message._id);
  await conversation.save();
  res.status(StatusCodes.CREATED).json({ msg: "Message Created", message });
};

const createImgMessage = async (req, res) => {
  res.send("createImg");
};

const getRecentMessages = async (req, res) => {
  const { conversationId, page = 1, limit = 20 } = req.body;
  const skip = (Number(page) - 1) * Number(limit);
  if (!conversationId) {
    throw new CustomErorr.BadRequestError("Conversation id must be provided");
  }
  const conversation = await Conversation.findOne({
    _id: conversationId,
  }).populate({
    path: "messages",
    select: "senderId text type imageUrl timestamp",
    options: {
      sort: { timestamp: 1 },
      skip: Number(skip),
      limit: Number(limit),
    },
    populate: {
      path: "senderId",
      select: "username role email",
    },
  });
  if (!conversation) {
    throw new CustomErorr.NotFoundError(
      `No conversation with id: ${conversationId}`
    );
  }
  res.status(StatusCodes.OK).json({
    nbHits: conversation.messages.length,
    page: Number(page),
    mesages: conversation.messages,
  });
};

const clearMessageHistory = async (req, res) => {
  const { conversationId } = req.body;
  if (!conversationId) {
    throw new CustomErorr.BadRequestError("Conversation id must be provided");
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  if (!conversation) {
    throw new CustomErorr.NotFoundError(
      `No conversation with id: ${conversationId}`
    );
  }
  conversation.messages = [];
  await conversation.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Conversation history cleared", conversation });
};

const notifyOnNewMessage = async () => {};

module.exports = {
  createTextMessage,
  createImgMessage,
  getRecentMessages,
  clearMessageHistory,
  notifyOnNewMessage,
};
