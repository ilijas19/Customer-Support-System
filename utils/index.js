const sendVerificationEmail = require("./sendVerificationEmail");
const { verifyJwt, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const sendPasswordResetEmail = require("./sendResetPasswordEmail");

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  verifyJwt,
  attachCookiesToResponse,
  createTokenUser,
};
