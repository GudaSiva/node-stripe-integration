"use strict";
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { httpsStatusCodes, httpResponses } = require("../constants");
const { User } = require("../models/postgres");
const { successResponse, errorResponse } = require("../utils/response.util");
const { jwtConfig } = require("../configs/jwt.config");
const sendEmail = require("../utils/send-email.util");

// register User
const signUp = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    //jf user exists
    const userExits = await User.findOne({ where: { email } });
    if (userExits) {
      return res.json(errorResponse("USER_ALREADY_EXISTS"));
    }
    //creating user details to the database
    const userCreate = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });
    // Prepare response data by excluding id, password, and deleted_at
    const responseData = {
      uuid: userCreate.uuid,
      gender: userCreate.gender,
      user_type: userCreate.user_type,
      status: userCreate.status,
      is_email_verified: userCreate.is_email_verified,
      first_name: userCreate.first_name,
      last_name: userCreate.last_name,
      email: userCreate.email,
      phone_number: userCreate.phone_number,
      updated_at: userCreate.updated_at,
      created_at: userCreate.created_at,
    };
    // Generate JWT Token for User
    const jwtToken = jwt.sign(
      {
        email: responseData.email,
        id: responseData.id,
      },
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.tokenExpiration }
    );

    // Construct Email Subject and Template
    const subject = "Registered Successfully";
    let signUpTemplate = fs.readFileSync(
      "resources/views/template/sign-up.template.html",
      "utf8"
    );

    // Personalize Email Template with User Information
    signUpTemplate = signUpTemplate.replaceAll("##first_name##", first_name);
    signUpTemplate = signUpTemplate.replaceAll("##last_name##", last_name);
    signUpTemplate = signUpTemplate.replaceAll("##email##", email);
    signUpTemplate = signUpTemplate.replaceAll(
      "##token##",
      `/verify-email?token=${jwtToken}`
    );

    // Send Registration Email with Verification Link
    await sendEmail(email, subject, signUpTemplate);
    return res.json(
      successResponse(
        responseData,
        "USER_CREATED_SUCCESSFULLY",
        httpsStatusCodes.CREATED,
        httpResponses.CREATED
      )
    );
  } catch (error) {
    return res.json(
      errorResponse("SOME_THING_WENT_WRONG_WHILE_CREATING_SIGN_UP")
    );
  }
};

module.exports = { signUp };
