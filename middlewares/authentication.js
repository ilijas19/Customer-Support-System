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
  try {
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
        return res.redirect("/login");
      }
      req.user = decoded.user;
      return next();
    }
    return res.redirect("/login");
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = { authorizePermission, authenticateUser };
