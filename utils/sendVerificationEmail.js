const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  email,
  verificationToken,
  origin,
  username,
}) => {
  const message = `
  <p>Click on the following link to verify your email :
  <a href='${origin}/verifyEmail?verificationToken=${verificationToken}&email=${email}>Verify</a>
  </p>
  `;

  await sendEmail({
    to: email,
    subject: "Email Verification",
    message,
    username,
  });
};

module.exports = sendVerificationEmail;
