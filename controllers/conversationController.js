const Conversation = require("../model/Conversation");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createConversation = async (req, res) => {
  res.send("createConversation");
};
const getOperatorConversations = async (req, res) => {
  res.send("getOperatorConversations");
};
const getConversationHistory = async (req, res) => {
  res.send("getConversationHistory");
};
const openConversation = async (req, res) => {
  res.send("openConversation");
};
const closeConversation = async (req, res) => {
  res.send("closeConversation");
};
const deleteConversation = async (req, res) => {
  res.send("deleteConversation");
};

module.exports = {
  createConversation,
  getOperatorConversations,
  getConversationHistory,
  openConversation,
  closeConversation,
  deleteConversation,
};
