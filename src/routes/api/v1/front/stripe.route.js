"use strict";
const express = require("express");
const {
  isAuthentication,
} = require("../../../../middlewares/authentication-middleware");
const {
  checkOutSession,
} = require("../../../../controllers/stripe.controller");
const router = express.Router();

router.post(
  "/create-subscription-user",
  // isAuthentication,
  checkOutSession
);
module.exports = router;
