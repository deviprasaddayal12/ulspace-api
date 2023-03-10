const responses = require("../../utility/responses");
const service = require("./auth.service.js");
const { Options } = require("../../utility/enums");
const { Auth } = require("../../utility/constants");

const TAG = "auth.controller";

const signUp = async (req, res) => {
  try {
    let result;

    // let role = Options.User.Roles.BUYER;
    // const { userRole } = req.query;
    // if (userRole) role = userRole;
    // console.log(req.body);

    switch (parseInt(req.body.role)) {
      case Options.User.Roles.ADMIN:
        result = await service.createAdmin(req.headers, req.body);
        break;
      case Options.User.Roles.SELLER:
        result = await service.createSeller(req.headers, req.body);
        break;
      case Options.User.Roles.INFLUENCER:
        result = await service.createInfluencer(req);
        break;
      default:
        result = await service.createBuyer(req.headers, req.body, req.file);
        break;
    }
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message);
    }

    return responses.successResponse(res, result, Auth.OK_SIGNUP_OTP_SENT);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const checkUsername = async (req, res) => {
  try {
    const result = await service.checkUsername(req.headers, req.query.username);
    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const signInByPassword = async (req, res) => {
  try {
    const result = await service.signInByPassword(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.data, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const signInByOtp = async (req, res) => {
  try {
    const result = await service.signInByOtp(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.data, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const verifyAnswer = async (req, res) => {
  try {
    const result = await service.verifyAnswer(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const resendOtp = async (req, res) => {
  try {
    const result = await service.resendOtp(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message);
    }

    return responses.successResponse(res, result.message);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const result = await service.verifyOtp(req.headers, req.body);
    console.log(`${TAG}.verifyOtp: `, result);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message, result.data);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const forgotUsername = async (req, res) => {
  try {
    const result = await service.forgotUsername(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await service.forgotPassword(req.headers, req.body);
    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const resetPassword = async (req, res) => {
  console.log("request-----", req.body);
  try {
    const result = await service.resetPassword(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.message);
    }

    return responses.successResponse(res, result.message);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  signUp,
  checkUsername,

  signInByOtp,
  signInByPassword,
  verifyAnswer,

  resendOtp,
  verifyOtp,

  forgotUsername,
  forgotPassword,
  resetPassword,
};
