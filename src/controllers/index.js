const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("./auth.controller");

module.exports = { signUp, login, forgotPassword, resetPassword, verifyEmail };
