const { transporter } = require("./emailConfig");
const {
  Verification_Email_Template,
  Welcome_Email_Template,
} = require("./emailTemplate");
const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"DonateHope" <smarikachaudhary10@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify your email", // Subject line
      text: "Verify your email", // plain text body
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ), // HTML body
    });
    console.log("Email Sent Successfully!", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

const welcomeEmail = async (email, role) => {
  try {
    const response = await transporter.sendMail({
      from: '"DonateHope" <smarikachaudhary10@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify your email", // Subject line
      text: "Verify your email", // plain text body
      html: Welcome_Email_Template.replace("{name}", role), // HTML body
    });
    console.log("Email Sent Successfully!", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

module.exports = { sendVerificationCode, welcomeEmail };
