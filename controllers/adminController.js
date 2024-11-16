const User = require("../model/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const queryObject = {};
  const users = await User.find(queryObject);
  res.status(StatusCodes.OK).json(users);
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("User id must be provided");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  res.send("updateUser");
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("User id must be provided");
  }
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `User '${user.username}' deleted from database` });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
