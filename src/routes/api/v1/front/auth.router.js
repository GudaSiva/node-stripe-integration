const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../../../../controllers");
const { validateInput } = require("../../../../utils/validate.util");
const {
  signUpSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
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
router.post("/email-verify", validateInput(verifyEmailSchema), verifyEmail);
module.exports = router;
