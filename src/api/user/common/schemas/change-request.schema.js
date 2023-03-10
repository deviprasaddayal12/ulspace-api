const { model, Schema, default: mongoose } = require("mongoose");

const ChangeEmailSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  newEmail: {
    type: String,
    required: true,
  },
  isCurrentPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isCurrentEmailVerified: {
    type: Boolean,
    default: false,
  },
  isNewEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports.ChangeEmailSchema = ChangeEmailSchema;
module.exports.ChangeEmail = model("ChangeEmail", ChangeEmailSchema);

const ChangePhoneSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  newPhone: {
    type: String,
    required: true,
  },
  isCurrentPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isCurrentEmailVerified: {
    type: Boolean,
    default: false,
  },
  isNewPhoneVerified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports.ChangePhoneSchema = ChangePhoneSchema;
module.exports.ChangePhone = model("ChangePhone", ChangePhoneSchema);

const ChangePasswordSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  newPassword: {
    type: String,
    required: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports.ChangePasswordSchema = ChangePasswordSchema;
module.exports.ChangePassword = model("ChangePassword", ChangePasswordSchema);
