const Joi = require("joi");

const createSubscriptionSchema = Joi.object({
  plan_title: Joi.string().required().messages({
    "string.base": "PLAN_TITLE SHOULD BE A TYPE OF 'TEXT'",
    "string.empty": "PLAN_TITLE CANNOT BE AN EMPTY FIELD",
    "any.required": "PLAN_TITLE IS A REQUIRED FIELD",
  }),
  plan_description: Joi.string().optional().allow("").messages({
    "string.base": "PLAN_DESCRIPTION SHOULD BE A TYPE OF 'TEXT'",
  }),
  plan_features: Joi.array().min(1).messages({
    "array.base": "PLAN_FEATURES_REQUIRED",
    "array.empty": "PLAN_FEATURES_REQUIRED",
    "any.required": "PLAN_FEATURES_REQUIRED",
    "array.min": "AT_LEAST_ONE_PLAN_FEATURE_REQUIRED",
  }),
  plan_price: Joi.number().required().messages({
    "number.base": "PLAN_PRICE SHOULD BE A TYPE OF 'NUMBER'",
    "any.required": "PLAN_PRICE IS A REQUIRED FIELD",
  }),
  plan_id: Joi.string().required().messages({
    "string.base": "PLAN_ID SHOULD BE A TYPE OF 'TEXT'",
    "string.empty": "PLAN_ID CANNOT BE AN EMPTY FIELD",
    "any.required": "PLAN_ID IS A REQUIRED FIELD",
  }),
  status: Joi.string().valid("Active", "Inactive").messages({
    "string.base": "STATUS SHOULD BE A TYPE OF 'TEXT'",
    "any.only": "STATUS SHOULD BE ONE OF ['ACTIVE', 'INACTIVE']",
  }),
});

module.exports = { createSubscriptionSchema };
