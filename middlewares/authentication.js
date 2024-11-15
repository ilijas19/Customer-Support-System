const Token = require("../model/Token");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { verifyJwt } = require("../utils");

const authorizePermission = (...roles) => {
  return async (req, res, next) => {
    if (req.user.role === "admin") return next();
    if (roles.includes(req.user.role)) return next();
    throw new CustomError.UnauthorizedError("Not Authorized to use this route");
  };
};

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (accessToken) {
    const decoded = verifyJwt(accessToken);
    req.user = decoded;
    return next();
  }
  if (refreshToken) {
    const decoded = verifyJwt(refreshToken);
    const { isValid } = await Token.findOne({
      user: decoded.user.userId,
      refreshToken: decoded.refreshToken,
    });
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Failed");
    }
    req.user = decoded.user;
    return next();
  }
  throw new CustomError.UnauthenticatedError("Authentication Failed");
};

module.exports = { authorizePermission, authenticateUser };
