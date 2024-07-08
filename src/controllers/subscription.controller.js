const { errorResponse, successResponse } = require("../utils/response.util");
const { SubscriptionPlan } = require("../models/postgres");
const {
  httpsStatusCodes,
  httpResponses,
  stripeConstant,
} = require("../constants");
const { stripe } = require("../utils/stripe.util");

const createSubscription = async (req, res) => {
  try {
    const {
      plan_title,
      plan_description,
      plan_features,
      plan_price,
      plan_id,
      status,
    } = req.body;
    const subscription = await SubscriptionPlan.create({
      plan_title,
      plan_description,
      plan_features,
      plan_price,
      plan_id,
      status,
    });
    // Stripe Integration for Subscription Create
    const createStripeProductPrice = await stripe.products.create({
      name: plan_title,
      description: plan_description,
      active: false,
      default_price_data: {
        currency: stripeConstant.stripeConfig.currency,
        unit_amount: plan_price * 100,
      },
    });
    if (createStripeProductPrice) {
      // Updating Purchase Price id generated from stripe
      await SubscriptionPlan.update(
        { plan_id: createStripeProductPrice.id },
        { where: { id: subscription.id } }
      );
    }
    res.json(
      successResponse(
        subscription,
        "SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY",
        httpsStatusCodes.CREATED,
        httpResponses.CREATED
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        error ? error.message : "SOME_ERR_OCCUR_WHILE_SUBSCRIPTION_PLAN",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

module.exports = { createSubscription };
