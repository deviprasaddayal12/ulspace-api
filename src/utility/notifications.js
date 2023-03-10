var SibApiV3Sdk = require("sib-api-v3-sdk");
const { Notify } = require("./constants");

const TAG = "notifications";

module.exports = {
  sendEmailOtp: async (user) => {
    try {
      SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
        process.env.SENDINBLUE_KEY;

      let otp = Math.random(15).toString(10).split(".")[1].substring(1, 7);

      // let sendResult =
      //   new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
      //     subject: "OTP - Koboldo",
      //     sender: { email: "aloktemp5@gmail.com", name: "Koboldo" },
      //     replyTo: { email: "aloktemp5@gmail.com", name: "Koboldo" },
      //     to: [{ name: `${user.username}`, email: `${user.email}` }],
      //     htmlContent:
      //       "<html><body><h1>Your otp is {{params.bodyMessage}}</h1></body></html>",
      //     params: { bodyMessage: `${otp}` },
      //   });
      console.log(`${TAG}.sendEmailOtp: `, sendResult);

      return {
        otp,
      };
    } catch (e) {
      console.log(`${TAG}.sendEmailOtp: `, e.error);
      return {
        status: 999,
        message: Notify.COULD_NOT_SEND_EMAIL_OTP,
      };
    }
  },

  sendPhoneOtp: async (user) => {
    try {
      SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
        process.env.SENDINBLUE_KEY;

      let otp = Math.random(15).toString(10).split(".")[1].substring(1, 7);

      // let sendResult = new SibApiV3Sdk.TransactionalSMSApi().sendTransacSms({
      //   sender: "7008517232",
      //   recipient: `${user.phone}`,
      //   content: `Your otp is ${otp}`,
      // });
      // console.log(`${TAG}.sendPhoneOtp: `, sendResult);

      return {
        otp,
      };
    } catch (e) {
      console.log(`${TAG}.sendPhoneOtp: `, e.error);
      return {
        status: 999,
        message: Notify.COULD_NOT_SEND_PHONE_OTP,
      };
    }
  },
};
