const CustomApiError = require("./custom-error");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  CustomApiError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
};
