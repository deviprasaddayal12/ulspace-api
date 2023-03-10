const express = require("express");
const router = express.Router();

const controller = require("./auth.controller");
const validator = require("../../validator/validator");
const { AuthValidation } = require("../../validator/validations");
const multer = require("multer");

router.post(
  "/checkUsername",
  validator(AuthValidation.usernameAvailability, "query"),
  controller.checkUsername
);
router.post(
  "/signUp/buyer",
  multer().single("profile"),
  validator(AuthValidation.signUpBuyer, "body"),
  controller.signUp
);
router.post(
  "/signUp/influencer",
  multer().single("profile"),
  validator(AuthValidation.signUpInfluencer, "body"),
  controller.signUp
);

router.post(
  "/signInByOtp",
  validator(AuthValidation.signInByOtp, "body"),
  controller.signInByOtp
);
router.post(
  "/signInByPassword",
  validator(AuthValidation.signInByPassword, "body"),
  controller.signInByPassword
);
router.post(
  "/answers/verify",
  validator(AuthValidation.verifyAnswer, "body"),
  controller.verifyAnswer
);

router.post(
  "/resendOtp",
  validator(AuthValidation.sendOtp, "body"),
  controller.resendOtp
);
router.post(
  "/verifyOtp",
  validator(AuthValidation.verifyOtp, "body"),
  controller.verifyOtp
);

router.post(
  "/forgotUsername",
  validator(AuthValidation.forgotUsername, "body"),
  controller.forgotUsername
);
router.post(
  "/forgotPassword",
  validator(AuthValidation.forgotPassword, "body"),
  controller.forgotPassword
);
router.post(
  "/resetPassword",
  validator(AuthValidation.resetPassword, "body"),
  controller.resetPassword
);

module.exports = router;
