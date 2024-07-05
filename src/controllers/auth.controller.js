"use strict";
const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const UUID = require("uuid");
const { httpsStatusCodes, httpResponses } = require("../constants");
const { User, UserToken, ForgetPasswordToken } = require("../models/postgres");
const { successResponse, errorResponse } = require("../utils/response.util");
const { jwtConfig } = require("../configs/jwt.config");
const sendEmail = require("../utils/send-email.util");
const { comparePassword, generateHash } = require("../utils/password.util");
const DateFormat = "YYYY-MM-DD HH:mm:ss";
function dayToInt(day) {
  return parseInt(day, 10);
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Generate Unique Tokens
    const tokenUUID = crypto.randomUUID();
    const refreshTokenUUID = crypto.randomUUID();
    const userDetails = await User.findOne({ where: { email } });
    const comparePasswordString = await comparePassword(
      password,
      userDetails.password
    );
    if (!userDetails || !comparePasswordString) {
      return res.json(
        errorResponse(
          "INVALID_USER_DETAILS",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    if (!userDetails.is_email_verified) {
      return res.json(errorResponse("EMAIL_IS_NOT_VERIFIED"));
    }
    const jwtToken = jwt.sign(
      {
        email: userDetails.email,
        id: userDetails.id,
        tokenUUID,
      },
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.tokenExpiration }
    );
    // Calculate Access Token Expiration Time
    const expirationTime = moment(
      jwt.verify(jwtToken, jwtConfig.jwtSecret).exp * 1000
    ).format(DateFormat);

    // Calculate Access Token Expiration in Seconds
    const expiresIn =
      moment(jwt.verify(jwtToken, jwtConfig.jwtSecret).exp * 1000).unix() -
      moment().unix();

    // Generate Refresh Token with User Info and Refresh Token UUID
    const refreshToken = jwt.sign(
      { email: userDetails.email, id: userDetails.id, refreshTokenUUID },
      jwtConfig.refreshJwtSecretKey,
      {
        expiresIn: jwtConfig.refreshTokenExpiration,
      }
    );
    // Calculate Refresh Token Expiration Time
    const refreshTokenTime = moment(
      jwt.verify(refreshToken, jwtConfig.refreshJwtSecretKey).exp * 1000
    ).format(DateFormat);
    let response = {
      userDetails,
      token: jwtToken,
      refreshToken,
      expiresIn,
      expiresAt: expirationTime,
    };
    await UserToken.create({
      user_id: userDetails.id,
      token_uuid: tokenUUID,
      token_expireAt: expirationTime,
      refresh_token_uuid: refreshTokenUUID,
      refresh_token_expireAt: refreshTokenTime,
    });
    return res.json(successResponse(response, "LOGGED_IN_SUCCESSFULLY"));
  } catch (error) {
    return res.json(errorResponse("SOME_THING_WENT_WRONG_WHILE_LOGIN"));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Calculate Password Reset Token Expiration Time
    const todayDate = moment();
    const passwordExpiration = dayToInt(jwtConfig.forgotPasswordExpiration);
    const expiresAtDate = todayDate
      .add(passwordExpiration, "days")
      .format(DateFormat);
    const expiresAtResponse = moment(expiresAtDate).format(DateFormat);

    // Generate Unique Token UUID
    const tokenUUID = UUID.v4();

    // Find User based on Search Criteria
    const user = await User.findOne({ where: { email } });

    // Handle User Not Found
    if (!user) {
      return res.json(
        errorResponse(
          "USER_DOES_NOT_EXIST",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    // Generate Forgot Password JWT Token with User Email and Token UUID
    const jwtToken = jwt.sign(
      { email: user.email, tokenUUID },
      jwtConfig.forgotPasswordSecretKey,
      {
        expiresIn: jwtConfig.forgotPasswordExpiration,
      }
    );

    // Prepare Forgot Password Response
    const response = {
      token: jwtToken,
      expiresAt: expiresAtResponse,
    };

    // Construct Email Subject and Template
    const subject = "Password assistance";

    let resetPassUrl = `reset-password?token=${jwtToken}`;
    let emailTemplate = fs.readFileSync(
      "resources/views/template/forgot-password-email.template.html",
      "utf8"
    );
    // Personalize Email Template with User Name and Reset Link
    emailTemplate = emailTemplate.replace(
      "##first_name##",
      user.first_name !== undefined ? " " + user.first_name : ""
    );
    emailTemplate = emailTemplate.replace(
      "##last_name##",
      user.last_name !== undefined ? " " + user.last_name : ""
    );
    emailTemplate = emailTemplate.replace(
      /"##resetLink##"/g,
      resetPassUrl !== undefined ? resetPassUrl : ""
    );

    // Save Forgot Password Token Information
    await ForgetPasswordToken.create({
      token_uuid: tokenUUID,
      expiresAt: expiresAtDate,
      is_active: true,
    });

    // Send Forgot Password Email
    sendEmail(user.email, subject, emailTemplate);
    return res.json(
      successResponse(
        response,
        "RESET_PASSWORD_EMAIL_SENT_SUCCESSFULLY",
        httpsStatusCodes.SUCCESS
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        error ? error.message : "SOME_ERR_OCCUR_WHILE_FORGOT_PASSWORD",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;
    // Verify Forgot Password Token
    const verifyResetToken = await jwt.verify(
      token,
      jwtConfig.forgotPasswordSecretKey
    );
    // Find Reset Token Record based on UUID from verified token
    const findUserPasswordToken = await ForgetPasswordToken.findOne({
      where: {
        token_uuid: verifyResetToken.tokenUUID,
      },
    });
    // Handle Invalid or Expired Token
    if (!findUserPasswordToken || new Date() > verifyResetToken.expiresAt) {
      return res.json(errorResponse("INVALID_RESET_TOKEN"));
    }
    const userDetails = await User.findOne({
      where: { email: verifyResetToken.email },
    });
    if (!userDetails) {
      res.json(
        errorResponse(
          "USER_NOT_FOUND",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    // Handle Password Mismatch
    if (password !== confirmPassword) {
      return failure(
        "PASSWORD_AND_CONFIRM_PASSWORD_SHOULD_BE_MATCH",
        httpsStatusCodes.BAD_REQUEST,
        httpResponses.BAD_REQUEST
      );
    }
    // Hash the New Password
    const hashPass = await generateHash(password);
    // update password to hash password
    userDetails.password = hashPass;
    await userDetails.save({ fields: ["password"] }); // Update only the password field
    // Delete the used token
    await ForgetPasswordToken.destroy({
      where: { token_uuid: verifyResetToken.tokenUUID },
    });
    // Success Response
    return res.json(
      successResponse(
        "",
        "PASSWORD_CHANGED_SUCCESSFULLY",
        httpsStatusCodes.SUCCESS,
        httpResponses.SUCCESS
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        "SOME_THING_WENT_WRONG_WHILE_RESET_PASSWORD",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    // Verify email verification token
    const verifyToken = jwt.verify(token, jwtConfig.jwtSecret);
    if (!verifyToken) {
      return res.json(
        "INVALID_VERIFY_TOKEN",
        httpsStatusCodes.UNAUTHORIZED,
        httpResponses.UNAUTHORIZED
      );
    }
    // Check if user is already verified (ideally shouldn't be using token)
    const findUserDetails = await User.findOne({
      where: { email: verifyToken.email, is_email_verified: true },
    });
    if (findUserDetails) {
      return res.json(errorResponse("EMAIL_ALREADY_VERIFIED"));
    }
    // Update user email verification status within the transaction
    await User.update(
      { is_email_verified: true },
      {
        where: { email: verifyToken.email },
        returning: true,
        plain: true,
        raw: true,
      }
    );
    return res.json(
      successResponse(
        "",
        "EMAIL_SUCCESSFULLY_VERIFIED",
        httpsStatusCodes.SUCCESS,
        httpResponses.SUCCESS
      )
    );
  } catch (error) {
    return res.json(
      errorResponse(
        error ? error.message : "SOME_ERR_OCCUR_WHILE_VERIFY_EMAIL",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

const generateRefreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    // Generate a Unique Token UUID
    const tokenUUID = UUID.v4();
    // Verify the Refresh Token
    const decodedToken = jwt.verify(
      refresh_token,
      jwtConfig.refreshJwtSecretKey
    );
    if (!decodedToken) {
      // Invalid Refresh Token
      return failure(
        "REFRESH_TOKEN_NOT_FOUND",
        httpsStatusCodes.UNAUTHORIZED,
        httpResponses.UNAUTHORIZED
      );
    }
    // Generate a New Access Token based on Decoded Data
    const token = jwt.sign(
      {
        email: decodedToken.email,
        id: decodedToken.id,
        tokenUUID, // Include the new token UUID
      },
      jwtConfig.jwtSecret,
      {
        expiresIn: jwtConfig.tokenExpiration, // Set expiration time for access token
      }
    );
    // Find the User Token based on Decoded Refresh Token Information
    const userToken = await UserToken.findOne({
      where: {
        user_id: decodedToken.id,
        refresh_token_uuid: decodedToken.refreshTokenUUID,
      },
    });
    if (!userToken) {
      return res.json(
        errorResponse(
          "INVALID_REFRESH_TOKEN",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    // Calculate Expiration Time for the New Access Token
    const expiresIn =
      moment(jwt.verify(token, jwtConfig.jwtSecret).exp * 1000).unix() -
      moment().unix();

    // Update the User Token with the New Token UUID and Expiration Time
    await UserToken.update(
      {
        token_uuid: tokenUUID,
        token_expireAt: moment(
          jwt.verify(token, jwtConfig.jwtSecret).exp * 1000
        ).format(DateFormat),
      },
      { where: { user_id: userToken.id } }
    );

    // Prepare the Response with Access Token, Refresh Token, Expiration Info
    const response = {
      token,
      refresh_token, // You might consider not including the refresh token in the response for security reasons
      expiresIn,
      expiresAt: moment(
        jwt.verify(token, jwtConfig.jwtSecret).exp * 1000
      ).format(DateFormat),
    };

    // Success Response with Refresh Token Details
    return res.json(
      successResponse(response, "SUCCESSFULLY_REFRESH_TOKEN_FETCHED")
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

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  generateRefreshToken,
};
