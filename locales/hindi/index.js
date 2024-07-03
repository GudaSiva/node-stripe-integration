const { messages } = require("./messages.js");
const { validations } = require("./validations.js");
const { errors } = require("./errors.js");

const hindiTranslations = { ...messages, ...validations, ...errors };

module.exports = {hindiTranslations };
