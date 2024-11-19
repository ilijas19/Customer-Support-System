const User = require("../model/User");
const Message = require("../model/Message");
const Conversation = require("../model/Conversation");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createConversation = async (req, res) => {
  const { operatorId, userId } = req.body;
  if (!operatorId || !userId) {
    throw new CustomError.BadRequestError("Both id values needed");
  }
  const operator = await User.findOne({ _id: operatorId, role: "operator" });
  const user = await User.findOne({ _id: userId, role: "user" });
  if (!operator) {
    throw new CustomError.NotFoundError(`No operator with id:${operatorId}`);
  }
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }

  // const existingConversation = await Conversation.findOne({
  //   operatorId,
  //   userId,
  // });
  // if (existingConversation) {
  //   throw new CustomError.BadRequestError(
  //     "There is ongoing conversation with this user"
  //   );
  // }

  const conversation = await Conversation.create({
    operatorId: operator._id,
    userId: user._id,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Conversation Created",
    conversation: {
      operator: {
        username: operator.username,
        operatorId,
      },
      user: {
        username: user.username,
        userId,
      },
      conversationId: conversation._id,
    },
  });
};

const getOperatorConversations = async (req, res) => {
  const operator = await User.findOne({
    _id: req.user.userId,
    role: "operator",
  });

  if (!operator) {
    throw new CustomError.BadRequestError("Operator not logged in");
  }
  const queryObject = { operatorId: operator._id };
  const conversations = await Conversation.find(queryObject)
    .populate({
      path: "userId",
      select: "username",
    })
    .populate({
      path: "operatorId",
      select: "username",
    });
  res.status(StatusCodes.OK).json({ conversations });
};

const getConversationHistory = async (req, res) => {
  const { id: conversationId } = req.params;
  if (!conversationId) {
    throw new CustomError.BadRequestError(
      "conversationId needs to be provided"
    );
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  if (!conversation) {
    throw new CustomError.NotFoundError("");
  }
  res.status(StatusCodes.OK).json({ chatMessages: conversation.messages });
};

const openConversation = async (req, res) => {
  const { id: conversationId } = req.params;
  if (!conversationId) {
    throw new CustomError.BadRequestError(
      "conversationId needs to be provided"
    );
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  if (!conversation) {
    throw new CustomError.NotFoundError(
      `No conversation with id: ${conversationId}`
    );
  }
  conversation.status = "open";
  await conversation.save();
  res.status(StatusCodes.OK).json({ msg: "Status open", conversation });
};

const closeConversation = async (req, res) => {
  const { id: conversationId } = req.params;
  if (!conversationId) {
    throw new CustomError.BadRequestError(
      "conversationId needs to be provided"
    );
  }
  const conversation = await Conversation.findOne({ _id: conversationId });
  if (!conversation) {
    throw new CustomError.NotFoundError(
      `No conversation with id: ${conversationId}`
    );
  }
  conversation.status = "closed";
  await conversation.save();
  res.status(StatusCodes.OK).json({ msg: "Status closed", conversation });
};

const deleteConversation = async (req, res) => {
  const { id: conversationId } = req.params;
  if (!conversationId) {
    throw new CustomError.BadRequestError(
      "conversationId needs to be provided"
    );
  }
  const conversation = await Conversation.findOne({
    _id: conversationId,
  });
  if (!conversation) {
    throw new CustomError.NotFoundError(
      `No conversation with id: ${conversationId}`
    );
  }

  await Message.deleteMany({ conversationId });
  await conversation.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Conversation Deleted" });
};

module.exports = {
  createConversation,
  getOperatorConversations,
  getConversationHistory,
  openConversation,
  closeConversation,
  deleteConversation,
};
