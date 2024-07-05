"use strict";
const stripeConfig = {
  stripe_secret: process.env.STRIPE_SECRET_KEY,
  stripe_publish_key: process.env.STRIPE_PUBLISH_KEY,
};

module.exports = stripeConfig;
