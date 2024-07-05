"use strict";
const express = require("express");
const { createTask } = require("../../../../controllers/task.controller");
const { validateInput } = require("../../../../utils/validate.util");
const { createTaskSchema } = require("../../../../validations/task.validation");
const {
  isAuthentication,
} = require("../../../../middlewares/authentication-middleware");
const router = express.Router();

router.post(
  "/create",
  isAuthentication,
  validateInput(createTaskSchema),
  createTask
);
module.exports = router;
