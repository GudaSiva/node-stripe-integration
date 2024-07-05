"use strict";
const express = require("express");
const { validateInput } = require("../../../../utils/validate.util");
const {
  createSubscription,
} = require("../../../../controllers/subscription.controller");
const {
  createSubscriptionSchema,
} = require("../../../../validations/subscription.validation");
const {
  isAuthentication,
} = require("../../../../middlewares/authentication-middleware");
const router = express.Router();

router.post(
  "/create",
  validateInput(createSubscriptionSchema),
  createSubscription
);
module.exports = router;
