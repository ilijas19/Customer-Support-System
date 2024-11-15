const CustomApiError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "CastError") {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `${err.value} is not a valid id` });
  }
  if (err.code == 11000) {
    const duplicateKey = Object.keys(err.keyValue);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `${duplicateKey} is already in use` });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something Went Wrong" });
};

module.exports = errorHandler;
