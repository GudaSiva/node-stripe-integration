"use strict";
const httpsStatusCodes = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  ERROR: 500,
  ACCESS_DENIED: 403,
  ALREADY_EXISTS: 409,
});
module.exports = { httpsStatusCodes };
