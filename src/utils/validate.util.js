const { httpResponses, httpsStatusCodes } = require("../constants");
const { errorResponse } = require("./response.util");

const validateInput = (schema) => {
  return (req, res, next) => {
    let reqData = req.body;
    if (req.method === "GET" || req.method === "DELETE") {
      reqData = { ...req.params, ...req.query };
    }
    if (
      req.method === "PUT" ||
      req.method === "PATCH" ||
      req.method === "POST"
    ) {
      reqData = { ...reqData, ...req.params };
    }
    const { error } = schema.validate(reqData);

    const valid = error == null;
    if (!valid) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      return res
        .status(httpsStatusCodes.BAD_REQUEST)
        .json(
          errorResponse(
            message,
            httpResponses.BAD_REQUEST,
            httpsStatusCodes.BAD_REQUEST,
            httpResponses.VALIDATION_ERROR
          )
        );
    }
    next();
    return null;
  };
};

module.exports = { validateInput };
