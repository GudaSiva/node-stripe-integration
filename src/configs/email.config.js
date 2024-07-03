"use strict";
const emailConfig = {
  /*
  |--------------------------------------------------------------------------
  | Email credentials
  |--------------------------------------------------------------------------
  */
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
  mailFrom: process.env.MAIL_FROM,
  service: process.env.SERVICE,
};
module.exports = { emailConfig };
