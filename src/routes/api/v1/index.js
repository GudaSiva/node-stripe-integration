const express = require("express");

const router = express.Router()

router.use("/front",require("./front"))
module.exports = router