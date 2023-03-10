const express = require("express");
const { multer } = require("../../../middlewares/uploads/multer");
const validator = require("../../../validator/validator");
const { UserValidation } = require("../../../validator/validations");
const {
  validateBuyer,
  validateSeller,
} = require("../../../middlewares/guards/entry.guard");
const controller = require("./user-common.controller");

const router = express.Router();

router.get("/", controller.getUser);
router.get(
  "/all",
  validator(UserValidation.getAll, "query"),
  controller.getAllUsers
);
router.put("/", controller.updateUser);
router.post("/profile", multer().single("profile"), controller.updateProfile);
router.delete("/", controller.deleteUser);

router.post(
  "/change/password",
  validator(UserValidation.changePassword, "body"),
  controller.changePassword
);
router.post(
  "/change/email",
  validator(UserValidation.changeEmail, "body"),
  controller.changeEmail
);
router.post(
  "/change/phone",
  validator(UserValidation.changePhone, "body"),
  controller.changePhone
);

router.post(
  "/otp/resend",
  validator(UserValidation.sendOtp, "body"),
  controller.resendOtp
);
router.post(
  "/otp/verify",
  validator(UserValidation.verifyOtp, "body"),
  controller.verifyOtp
);

router.delete(
  "/devices/:deviceId",
  validator(UserValidation.deleteDevice, "params"),
  controller.deleteDevice
);
router.post("/token/refresh", controller.refreshToken);

router.post(
  "/logout",
  validator(UserValidation.logout, "query"),
  controller.logout
);

module.exports = router;
