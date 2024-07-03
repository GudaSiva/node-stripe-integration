const { messages } = require("./messages.js");
const { validations } = require("./validations.js");
const { errors } = require("./errors.js");

const englishTranslations = { ...messages, ...validations, ...errors };

module.exports = { englishTranslations };
