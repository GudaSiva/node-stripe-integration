const { errorResponse, successResponse } = require("../utils/response.util");
const { Task } = require("../models/postgres");
const { httpsStatusCodes, httpResponses } = require("../constants");

const createTask = async (req, res) => {
  try {
    const { user } = req;
    const { title, description, status, due_date } = req.body;
    console.log(/user/, user);
    const task = await Task.create({ title, description, status, due_date });
    res.json(
      successResponse(
        task,
        "TODO_TASK_CREATED_SUCCESSFULLY",
        httpsStatusCodes.CREATED,
        httpResponses.CREATED
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        error ? error.message : "SOME_ERR_OCCUR_WHILE_REFRESH_TOKEN",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

module.exports = { createTask };
