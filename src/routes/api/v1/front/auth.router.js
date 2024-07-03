const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  generateRefreshToken,
} = require("../../../../controllers");
const { validateInput } = require("../../../../utils/validate.util");
const {
  signUpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  generateRefreshTokenSchema,
} = require("../../../../validations/auth.validation");
const {
  isAuthentication,
} = require("../../../../middlewares/authentication-middleware");
const router = express.Router();
router.post("/sign-up", validateInput(signUpSchema), signUp);
router.post("/log-in", validateInput(loginSchema), login);
router.post(
  "/forgot-password",
  isAuthentication,
  validateInput(forgetPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password",
  validateInput(resetPasswordSchema),
  resetPassword
);
router.post(
  "/refresh-token",
  validateInput(generateRefreshTokenSchema),
  generateRefreshToken
);
router.post("/email-verify", validateInput(verifyEmailSchema), verifyEmail);
module.exports = router;
