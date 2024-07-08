const {
  httpResponses,
  httpsStatusCodes,
  stripeConstant,
} = require("../constants");
const { SubscriptionPlan, UserSubscription } = require("../models/postgres");
const { stripe } = require("../utils/stripe.util");
const { errorResponse, successResponse } = require("../utils/response.util");
const { baseUrl } = require("../configs/global.config");

const checkOutSession = async (req, res) => {
  try {
    const { user } = req;
    console.log(/user/, user);
    const { email, plan_uuid } = req.body;
    if (!user) {
      return res.json(
        errorResponse(
          "USER_NOT_FOUND",
          httpsStatusCodes.NOT_FOUND,
          httpsStatusCodes.NOT_FOUND
        )
      );
    }
    const plan = await SubscriptionPlan.findOne(plan_uuid);
    console.log(/plane/, plan);
    if (!plan) {
      return res.json(
        errorResponse(
          "SUBSCRIPTION_PLAN_NOT_FOUND",
          httpsStatusCodes.NOT_FOUND,
          httpsStatusCodes.NOT_FOUND
        )
      );
    }

    const customer = await stripe.customers.create({
      email,
    });
    // Create stripe payment checkout instance
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: stripeConstant.stripeConfig.mode,
      line_items: [
        {
          price_data: {
            // name: plan.plan_title,
            product: plan.plan_id,
            currency: stripeConstant.stripeConfig.currency,
            unit_amount: plan.plan_price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });
    await UserSubscription.create({
      user_id: user.user_id,
      subscription_plan_id: plan.id,
      plan_title: plan.plan_title,
      stripe_subscription_id: session.id,
    });
    const sessionResponse = {
      url: session.url,
    };
    res
      .status(200)
      .json(
        successResponse(
          "SUBSCRIPTION_CREATED_SUCCESSFULLY",
          sessionResponse,
          httpsStatusCodes.SUCCESS,
          httpResponses.SUCCESS
        )
      );
  } catch (error) {
    return res.json(
      errorResponse(
        "SOME_THING_WENT_WRONG_WHILE_CREATE_SUBSCRIPTION_FOR_USER",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = { checkOutSession };
