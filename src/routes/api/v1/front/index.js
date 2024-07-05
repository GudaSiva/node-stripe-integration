const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/task", require("./task.route"));
router.use("/subscription", require("./subscription.route"));
router.use("/stripe", require("./stripe.route"));

module.exports = router;
