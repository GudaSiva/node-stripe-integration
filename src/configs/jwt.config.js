"use strict";
const jwtConfig = {
  /*
  |--------------------------------------------------------------------------
  | JWT
  |--------------------------------------------------------------------------
  */
  jwtSecret: process.env.JWT_SECRET_KEY,
  refreshJwtSecretKey: process.env.REFRESH_JWT_SECRET_KEY,
  tokenExpiration: process.env.TOKEN_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  forgotPasswordSecretKey: process.env.FORGET_PASSWORD_SECRET_KEY,
  forgotPasswordExpiration: process.env.FORGET_PASSWORD_EXPIRATION,
};

module.exports = { jwtConfig };
