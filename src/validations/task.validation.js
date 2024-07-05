const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "TITLE SHOULD BE A TYPE OF TEXT",
    "string.empty": "TITLE CANNOT BE AN EMPTY FIELD",
    "any.required": "TITLE IS A REQUIRED FIELD",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "DESCRIPTION SHOULD BE A TYPE OF TEXT",
  }),
  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .default("pending")
    .messages({
      "string.base": "STATUS SHOULD BE A TYPE OF TEXT",
      "any.only":
        "STATUS SHOULD BE ONE OF ['PENDING', 'IN_PROGRESS', 'COMPLETED']",
    }),
  due_date: Joi.date().optional().allow(null).messages({
    "date.base": "DUE_DATE SHOULD BE A VALID DATE",
  }),
});

module.exports = { createTaskSchema };
