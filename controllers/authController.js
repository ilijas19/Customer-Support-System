const User = require("../model/User");
const Token = require("../model/Token");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  attachCookiesToResponse,
  createTokenUser,
} = require("../utils");

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  //-creating user
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    email,
    username,
    password,
    verificationToken,
  });
  //-sending verification email
  const origin = process.env.ORIGIN || "http://localhost:5000";

  await sendVerificationEmail({ email, verificationToken, origin, username });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Check Your Email For Verification Link" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  if (!verificationToken || !email) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified emaiil");
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
  user.isVerified = true;
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Account verified" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No User With Specified Email");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Account not Verified");
  }
  const tokenUser = createTokenUser(user);

  //existing token
  const existingToken = await Token.findOne({ user: tokenUser.userId });
  if (existingToken) {
    const refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfully(existing token)", tokenUser });
  }
  //not existing token
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: tokenUser.userId,
  });
  res.status(StatusCodes.OK).json({ msg: "Login Successfully", tokenUser });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Email must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified email");
  }
  const oneDay = 1000 * 60 * 60 * 24;
  const passwordResetToken = crypto.randomBytes(40).toString("hex");
  const passwordResetExpDate = new Date(Date.now() + oneDay);
  const origin = process.env.ORIGIN || "http://localhost:5000";

  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpDate = passwordResetExpDate;
  await user.save();
  await sendPasswordResetEmail({
    email: user.email,
    passwordResetToken,
    origin,
    username: user.username,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Check you email for password reset link" });
};

const resetPassword = async (req, res) => {
  const { email, passwordResetToken, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No User with Specified Email");
  }
  if (user.passwordResetToken !== passwordResetToken) {
    throw new CustomError.BadRequestError("Reset Failed");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Reset" });
};

const showMe = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  showMe,
  logout,
};
