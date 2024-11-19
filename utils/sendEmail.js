const sgMail = require("@sendgrid/mail");

const sendEmail = async ({ to, subject, message, username }) => {
  try {
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // const msg = {
    //   to,
    //   from: "ilijagocic19@gmail.com",
    //   subject,
    //   html: `
    //   <h4>Hello ${username}</h4>
    //   ${message}
    //   `,
    // };
    // const result = await sgMail.send(msg);
    // if (result) {
    //   console.log("Email Sent");
    // }
    console.log("EmailSent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
