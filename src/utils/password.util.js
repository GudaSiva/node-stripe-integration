const bcrypt = require("bcrypt");

const generateHash = (str) => bcrypt.hash(str, 10);

const comparePassword = (str, hash) => bcrypt.compare(str, hash);

module.exports = { generateHash, comparePassword };
