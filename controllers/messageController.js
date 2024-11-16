const Message = require("../model/Message");
const Conversation = require("../model/Conversation");
const User = require("../model/User");
const CustomErorr = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createTextMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  if (!conversationId || !senderId || !text) {
    throw new CustomErorr.BadRequestError("All credientials must be proviided");
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  const sender = await User.findOne({ _id: senderId });
  if (!conversation) {
    throw new CustomErorr.NotFoundError(
      `No conversation with id ${conversationId}`
    );
  }
  if (!sender) {
    throw new CustomErorr.NotFoundError(`No user with id: ${senderId}`);
  }
  const message = await Message.create({ conversationId, senderId, text });
  conversation.messages.push(message._id);
  await conversation.save();
  res.status(StatusCodes.CREATED).json({ msg: "Message Created", message });
};

const createImgMessage = async (req, res) => {
  res.send("createImg");
};

const getRecentMessages = async (req, res) => {
  const { conversationId, page = 1, limit = 10 } = req.body;
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
