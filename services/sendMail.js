const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
  });

  try {
    const info = await transporter.sendMail({
      from: '"Raghav Dwivedi" <dwivediji425@gmail.com>',
      to: email,
      subject: subject,
      text: message, // plain text body
      html: ``, // html body (you can add HTML if needed)
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = sendMail;
