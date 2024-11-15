const sendEmail = require("./sendEmail");

const sendPasswordResetEmail = async ({
  email,
  passwordResetToken,
  origin,
  username,
}) => {
  const message = `
  <p>Click on the following link to reset your password :
  <a href='${origin}/passwordReset?passwordResetToken=${passwordResetToken}&email=${email}>Verify</a>
  </p>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    message,
    username,
  });
};

module.exports = sendPasswordResetEmail;
