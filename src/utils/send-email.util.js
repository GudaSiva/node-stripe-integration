"use strict";
const nodemailer = require("nodemailer");
const { emailConfig } = require("../configs/email.config");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.mailUsername,
        pass: emailConfig.mailPassword,
      },
    });
    await transporter.sendMail({
      from: emailConfig.mailFrom,
      to: email,
      subject,
      text,
      html: `<b>${text}</b>`,
    });
    console.log("Email sent successfully");
    return true;
  } catch (err) {
    console.log(err);
    return true;
  }
};

module.exports = sendEmail;
