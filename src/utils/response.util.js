"use strict";
const i18n = require("i18n");
const { httpsStatusCodes } = require("../constants");
const { httpResponses } = require("../constants/http-response.constant");

const successResponse = (
  data,
  message,
  statusCode = httpsStatusCodes.SUCCESS
) => {
  const result = {};
  result.meta = {
    message: i18n.__(message),
    statusCode,
    messageCode: message,
    status: httpResponses.SUCCESS,
  };
  if (data) {
    result.data = data;
  }
  return result;
};
const errorResponse = (
  message,
  error = "",
  statusCode = httpsStatusCodes.ERROR,
  errorType = httpResponses.ERROR
) => {
  const result = {};
  result.meta = {
    message: i18n.__(message),
    errorType,
    messageCode: message,
    statusCode,
    status: httpResponses.ERROR,
    error: error || i18n.__(message),
  };
  return result;
};

module.exports = { successResponse, errorResponse };
