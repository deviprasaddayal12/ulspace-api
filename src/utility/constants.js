module.exports = {
  ID_NOT_CORRECT_FORMAT: "Id should be proper object",
  NOT_AUTHORISED: "You don't have permission for this action.",

  CODE_API_SUCCESS: 200,
  CODE_ALGO_VALIDATION_FAILED: 900,
  CODE_DB_VALIDATION_FAILED: 901,
  CODE_EXCEPTION_OCCURRED: 899,

  Guard: {
    MISSING_LOCALE: "Missing locale in headers!",
    MISSING_DEVICE: "Missing deviceId in headers!",
    MISSING_LAN: "Missing lan(language-code) in headers!",
    MISSING_TOKEN: "",
    ERR_HEADERS_UNKNOWN: "Something's wrong with the headers!",
  },

  Auth: {
    INFLUENCER_REQUEST_NOT_EXISTS: "No influencer request was found!",
    USER_EXISTS: "User already exists with the provided credentials!",

    ACCESS_ADMIN_ONLY: "Only admins can perform this action!",
    ACCESS_BUYER_ONLY: "Only buyers can perform this action!",
    ACCESS_INFLUENCER_ONLY: "Only influencers can perform this action!",
    ACCESS_SELLER_ONLY: "Only sellers can perform this action!",

    NOT_USER_EXISTS: "User doesn't exist with the provided credentials!",
    NOT_VERIFIED_EMAIL: "Please verify your email!",
    NOT_VERIFIED_PHONE: "Please verify your phone!",
    NOT_VERIFIED_BOTH: "Please verify your email and phone!",
    NOT_PASSWORD_CORRECT: "Please provide the correct password!",
    NOT_OTP_CORRECT: "You've entered an incorrect otp!",
    NOT_QUESTION_FOUND: "Security question couldn't be found for the user!",
    NOT_ANSWER_CORRECT: "Security answer entered is incorrect!",

    OK_SIGNUP_OTP_SENT: "Otp has been sent to your email and phone!",
    OK_PASSWORD_RESET: "Password successfully reset!",
  },

  UserMsgs: {
    NOT_CORRECT_PASSWORD: "Incorrect password entered!",
    NOT_SHIPPING_ADDRESS_FOUND: "Shipping address not found!",
    NOT_PAYMENT_METHOD_FOUND: "Payment method not found!",

    PHONE_EXISTS_ALREADY: "Phone already exists!",
    EMAIL_EXISTS_ALREADY: "Email already exists!",

    CANT_DELETE_CURRENT_DEVICE:
      "You can't delete a device you're currently logged in!",

    DEVICE_DELETED_SUCCESSFULLY: "Device has been successfully removed!",
  },

  InfluencerMsgs: {
    REQUEST_STATUS: (status = "PENDING") => `Your requestis ${status}!`,
    REQUEST_ALREADY_PROCESSED: (status = "VERIFIED") =>
      `Your request has already been ${status}!`,
    REQUEST_PENDING: "Your request is pending to be verified!",
  },

  Notify: {
    COULD_NOT_SEND_EMAIL_OTP: "Something went wrong while sending email!",
    COULD_NOT_SEND_PHONE_OTP: "Something went wrong while sending sms!",

    OK_SEND_EMAIL_OTP: "Otp has been sent to your email successfully!",
    OK_SEND_PHONE_OTP: "Otp has been sent to your phone successfully!",
    OK_SEND_BOTH_OTP: "Otp has been sent to your email & phone successfully!",
  },
};
