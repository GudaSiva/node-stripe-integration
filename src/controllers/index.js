const {
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  generateRefreshToken,
} = require("./auth.controller");
const { signUp } = require("./user.controller");

module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  generateRefreshToken,
};
