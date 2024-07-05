const stripeConfig = require("../configs/stripe.config");

const stripe = require("stripe")(stripeConfig.stripe_secret);

module.exports = { stripe };
