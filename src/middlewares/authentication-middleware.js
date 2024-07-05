const jwt = require("jsonwebtoken");
const { User, UserToken } = require("../models/postgres");
const { httpsStatusCodes, httpResponses } = require("../constants");
const { errorResponse } = require("../utils/response.util");
const { jwtConfig } = require("../configs/jwt.config");

const isAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json(
        errorResponse(
          "MISSING_TOKEN",
          httpsStatusCodes.UNAUTHORIZED,
          httpResponses.UNAUTHORIZED
        )
      );
    }
    const jwtToken = token.split(" ")[1];
    const verifyToken = await jwt.verify(jwtToken, jwtConfig.jwtSecret);
    const userToken = await UserToken.findOne({
      where: { token_uuid: verifyToken.tokenUUID },
    });
    if (!userToken) {
      return res.json(
        errorResponse(
          "INVALID_TOKEN",
          httpsStatusCodes.UNAUTHORIZED,
          httpResponses.UNAUTHORIZED
        )
      );
    }
    const userDetails = await User.findOne({ where: { id: verifyToken.id } });
    req.user = {
      user_id: verifyToken.id,
      user: userDetails,
      tokenUUID: verifyToken.tokenUUID,
    };
    return next();
  } catch (error) {
    console.log(/error/,error)
    return res.json(
      errorResponse(
        "SOME_THING_WENT_WRONG_WHILE_TOKEN",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = { isAuthentication };
