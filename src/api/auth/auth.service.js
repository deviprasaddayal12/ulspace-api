const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { User } = require("../user/common/schemas/user.schema");
const { Device } = require("../user/common/schemas/device.schema");
const { Question } = require("../admin/security/schemas/question.schema");
const { MediaFile } = require("../common/schemas/file.schema");

const { Auth, Notify, InfluencerMsgs } = require("../../utility/constants");
const { sendEmailOtp, sendPhoneOtp } = require("../../utility/notifications");
const { Options } = require("../../utility/enums");
const { ShippingAddress } = require("../common/schemas/address.schema");
const {
  PaymentMethod,
} = require("../common/schemas/payments/payment-method.schema");
const { default: mongoose } = require("mongoose");
const {
  getBuyer,
  getInfluencer,
  getDetailedUser,
} = require("../user/common/user-common.service");
const { UserPush } = require("../../notifications/push.event-message");
const { sendPushPersonal } = require("../../notifications/push.main");

const TAG = "auth.service";

const getUser = async (data) => {
  // console.log(`${TAG}.getUser.data: `, data);
  let ored = [];
  if (data.phone) ored.push({ phone: data.phone });
  if (data.email) ored.push({ email: data.email });
  if (data.username) ored.push({ username: data.username });

  const user = await User.findOne({
    $or: ored,
  })
    .populate("securityAnswers")
    .populate("devices");
  // console.log(`${TAG}.getUser.result: `, user);
  // console.log(
  //   `${TAG}.getUser.${arguments.callee.name}: userId - `,
  //   user._id,
  //   ", deviceId - ",
  //   user.devices
  // );
  return user;
};

const isNewDevice = async (user, deviceId) => {
  console.log(`${TAG}.deviceId: `, deviceId);
  if (!user) return false;

  const userDevices = await Device.find({
    _id: { $in: user.devices },
  });
  console.log(`${TAG}.userDevices: `, userDevices);

  let isNewDevice = false;
  const matchedDevice = userDevices.find((device) => {
    return device.deviceId + "" === deviceId + "";
  });
  console.log(`${TAG}.matchedDevice: `, matchedDevice);

  isNewDevice = !matchedDevice || !matchedDevice.isVerified;
  console.log(`${TAG}.isNewDevice: `, isNewDevice);

  return isNewDevice;
};

async function createAndAddDeviceToUser(userId, deviceId, deviceInfo) {
  console.log(`${TAG}.createAndAddDeviceToUser: `, deviceInfo);
  try {
    let device = await Device.findOneAndUpdate(
      { deviceId: deviceId },
      deviceInfo,
      { new: true, upsert: true }
    );

    if (device) {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            devices: device._id,
          },
        },
        { new: true }
      );
    }

    return device;
  } catch (error) {
    console.log(`${TAG}.createAndAddDeviceToUser.catch: `, error);
    return null;
  }
}

const createBuyer = async (headers, data, file) => {
  try {
    const user = await getUser(data);
    if (user) {
      return {
        status: 900,
        message: Auth.USER_EXISTS,
      };
    }

    let inShippings = data.shippingAddresses;
    if (inShippings) {
      let savedShippings = await Promise.all(
        inShippings.map(async (shipping) => {
          return (await ShippingAddress.create(shipping))._id;
        })
      );
      data.shippingAddresses = savedShippings;
    }

    let inPMs = data.paymentMethods;
    if (inPMs) {
      let savedPMs = await Promise.all(
        inPMs.map(async (pm) => {
          return (await PaymentMethod.create(pm))._id;
        })
      );
      data.paymentMethods = savedPMs;
    }

    if (file) {
      data.profile = await MediaFile.create({
        mediaFile: await Buffer.from(file.buffer),
        fileName: file.originalName,
      });
    }

    let buyer = await Buyer.create(data);

    if (headers.deviceId) {
      await createAndAddDeviceToUser(buyer._id, headers.deviceId, {
        ...data.device,
        isActive: false,
        isSignUp: true,
        isVerified: false,
        jwtVersion: 1,
      });
    }

    return await sendOtp(headers, {
      for: Options.Auth.OtpFor.SIGN_UP,
      phone: buyer.phone,
    });
  } catch (error) {
    console.log(`${TAG}.createBuyer: `, error);
    return null;
  }
};

const createInfluencer = async ({ headers, body: data, file }) => {
  try {
    const influencerRequest = await InfluencerRequest.findById(data.request);
    if (!influencerRequest) {
      return {
        status: 900,
        message: Auth.INFLUENCER_REQUEST_NOT_EXISTS,
      };
    } else if (influencerRequest.status !== "APPROVED") {
      return {
        status: 900,
        message: InfluencerMsgs.REQUEST_PENDING(influencerRequest.status),
      };
    }
    const user = await getUser(data);
    if (user) {
      return {
        status: 900,
        message: Auth.USER_EXISTS,
      };
    }

    if (file) {
      data.profile = await MediaFile.create({
        mediaFile: await Buffer.from(file.buffer),
        fileName: file.originalName,
      });
    }

    let inPMs = data.paymentMethods;
    delete data.paymentMethods;

    let inCategories = data.targetCategories.map((c) =>
      mongoose.Types.ObjectId(c)
    );
    delete data.targetCategories;

    let influencer = await Influencer.create({
      ...data,
      influencerLevel: Options.Influencer.Levels.BASIC,
    });

    console.log(inPMs);
    if (inPMs) {
      influencer = await Influencer.findByIdAndUpdate(
        influencer._id,
        {
          $push: {
            paymentMethods: {
              $each: inPMs,
            },
          },
        },
        { new: true }
      );
    }

    console.log(inCategories);
    if (inCategories) {
      influencer = await Influencer.findByIdAndUpdate(
        influencer._id,
        {
          $addToSet: {
            categories: {
              $each: inCategories,
            },
          },
        },
        { new: true }
      );
    }

    if (headers.deviceId) {
      await createAndAddDeviceToUser(influencer._id, headers.deviceId, {
        ...data.device,
        isActive: false,
        isSignUp: true,
        isVerified: false,
        jwtVersion: 1,
      });
    }

    return await sendOtp(headers, {
      for: Options.Auth.OtpFor.SIGN_UP,
      phone: influencer.phone,
    });
  } catch (error) {
    console.log(`${TAG}.createInfluencer: `, error);
    return null;
  }
};

const createSeller = async (headers, data) => {
  try {
  } catch (error) {
    console.log(`${TAG}.createSeller: `, error);
    return null;
  }
};

const createAdmin = async (headers, data) => {
  try {
  } catch (error) {
    console.log(`${TAG}.createAdmin: `, error);
    return null;
  }
};

const checkUsername = async (headers, data) => {
  try {
    const results = await User.find({ username: data });
    // console.log(results);
    return { available: !results || !results.length };
  } catch (error) {
    console.log(`${TAG}.checkUsername: `, error);
    return null;
  }
};

const signInByPassword = async (headers, data) => {
  console.log(`${TAG}.signInByPassword: `);
  try {
    let user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
        data: {
          isNewDevice: true,
        },
      };
    }

    if (!(await user.verifyPassword(data.password))) {
      return {
        status: 900,
        message: Auth.NOT_PASSWORD_CORRECT,
      };
    }

    let device;
    if (user.role !== Options.User.Roles.ADMIN) {
      const isNewDevic = await isNewDevice(user, headers.deviceId);
      if (isNewDevic)
        await createAndAddDeviceToUser(user._id, headers.deviceId, {
          ...data.device,
          isActive: false,
          isSignUp: false,
          isVerified: false,
          jwtVersion: 1,
        });

      let questions = await Promise.all(
        user.securityAnswers.map(async (answer) => {
          return await Question.findById(answer.questionId);
        })
      );

      if (!user.isPhoneVerified && !user.isEmailVerified) {
        let otp = {};
        if (!isNewDevic)
          otp = await sendOtp(headers, {
            for: Options.Auth.OtpFor.SIGN_UP,
            email: user.email,
          });
        return {
          status: 900,
          message: Auth.NOT_VERIFIED_BOTH,
          data: {
            ...otp,
            email: user.email,
            phone: user.phone,
            isPhoneVerified: false,
            isEmailVerified: false,
            isNewDevice: isNewDevic,
            questions: isNewDevic ? questions : [],
          },
        };
      } else if (!user.isPhoneVerified) {
        let otp = {};
        if (!isNewDevic)
          otp = await sendOtp(headers, {
            for: Options.Auth.OtpFor.SIGN_UP,
            phone: user.phone,
          });
        return {
          status: 900,
          message: Auth.NOT_VERIFIED_PHONE,
          data: {
            ...otp,
            phone: user.phone,
            isPhoneVerified: false,
            isNewDevice: isNewDevic,
            questions: isNewDevic ? questions : [],
          },
        };
      } else if (!user.isEmailVerified) {
        let otp = {};
        if (!isNewDevic)
          otp = await sendOtp(headers, {
            for: Options.Auth.OtpFor.SIGN_UP,
            email: user.email,
          });
        return {
          status: 900,
          message: Auth.NOT_VERIFIED_EMAIL,
          data: {
            ...otp,
            email: user.email,
            isEmailVerified: false,
            isNewDevice: isNewDevic,
            questions: isNewDevic ? questions : [],
          },
        };
      }

      if (isNewDevic) {
        return {
          isNewDevice: isNewDevic,
          questions: await Promise.all(
            user.securityAnswers.map(async (answer) => {
              return await Question.findById(answer.questionId);
            })
          ),
        };
      }

      delete user.password;
      device = await Device.findOneAndUpdate(
        { deviceId: headers.deviceId },
        {
          $inc: { jwtVersion: 1 },
          $set: {
            isVerified: true,
            isActive: true,
            lastLoggedInAt: Date(),
            location: data.device.location,
            fcmToken: data.device.fcmToken,
          },
        },
        { new: true }
      );
      console.log(`${TAG}.signInByPassword: device=`, device);
    }

    return {
      token: jwt.sign(
        {
          id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
          phone: user.phone,
          deviceId: device?.deviceId,
          jwtVersion: device?.jwtVersion,
        },
        process.env.JWT_SIGN,
        { expiresIn: `${process.env.JWT_EXPIRY}` || "1h" }
      ),
      user: await getDetailedUser(user._id, user.role),
    };
  } catch (error) {
    console.log(`${TAG}.signIn: `, error);
    return null;
  }
};

const signInByOtp = async (headers, data) => {
  try {
    const user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
        data: {
          isNewDevice: false,
        },
      };
    }
    const isNewDevic = await isNewDevice(user, headers.deviceId);
    if (isNewDevic)
      await createAndAddDeviceToUser(user._id, headers.deviceId, {
        ...data.device,
        isActive: false,
        isSignUp: false,
        isVerified: false,
        jwtVersion: 1,
      });

    let questions = await Promise.all(
      user.securityAnswers.map(async (answer) => {
        return await Question.findById(answer.questionId);
      })
    );

    if (!user.isPhoneVerified && !user.isEmailVerified) {
      let otp = {};
      if (!isNewDevic)
        otp = await sendOtp(headers, {
          for: Options.Auth.OtpFor.SIGN_UP,
          email: user.email,
        });
      return {
        status: 900,
        message: Auth.NOT_VERIFIED_BOTH,
        data: {
          ...otp,
          email: user.email,
          phone: user.phone,
          isPhoneVerified: false,
          isEmailVerified: false,
          isNewDevice: isNewDevic,
          questions: isNewDevic ? questions : [],
        },
      };
    } else if (!user.isPhoneVerified) {
      let otp = {};
      if (!isNewDevic)
        otp = await sendOtp(headers, {
          for: Options.Auth.OtpFor.SIGN_UP,
          phone: user.phone,
        });
      return {
        status: 900,
        message: Auth.NOT_VERIFIED_PHONE,
        data: {
          ...otp,
          phone: user.phone,
          isPhoneVerified: false,
          isNewDevice: isNewDevic,
          questions: isNewDevic ? questions : [],
        },
      };
    } else if (!user.isEmailVerified) {
      let otp = {};
      if (!isNewDevic)
        otp = await sendOtp(headers, {
          for: Options.Auth.OtpFor.SIGN_UP,
          email: user.email,
        });
      return {
        status: 900,
        message: Auth.NOT_VERIFIED_EMAIL,
        data: {
          ...otp,
          email: user.email,
          isEmailVerified: false,
          isNewDevice: isNewDevic,
          questions: isNewDevic ? questions : [],
        },
      };
    }

    if (isNewDevic) {
      return {
        isNewDevice: true,
        questions: await Promise.all(
          user.securityAnswers.map(async (answer) => {
            return await Question.findById(answer.questionId);
          })
        ),
      };
    }

    return await sendOtp(headers, {
      for: Options.Auth.OtpFor.SIGN_IN,
      phone: user.phone,
    });
  } catch (error) {
    console.log(`${TAG}.signIn: `, error);
    return null;
  }
};

const verifyOtp = async (headers, data) => {
  try {
    let result = {};

    let user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }
    const isNewDevic = await isNewDevice(user, headers.deviceId);

    if (data.otp !== "123456") {
      return {
        status: 900,
        message: Auth.NOT_OTP_CORRECT,
        data: { isOtpCorrect: false },
      };
    }

    if (data.for === Options.Auth.OtpFor.SIGN_UP) {
      if (data.email) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isEmailVerified: true,
          },
          { new: true }
        );

        await Device.findOneAndUpdate(
          { deviceId: headers.deviceId },
          { isVerified: true, isActive: true },
          { new: true }
        );

        sendPushPersonal(UserPush.EVENT_CREATE_ACCOUNT.key, user._id, {
          ...UserPush.EVENT_CREATE_ACCOUNT,
          message: "Welcome to Koboldo" + user.firstName + " " + user.lastName,
        });

        result = {
          message: "You've successfully signed up!",
        };
      } else {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isPhoneVerified: true,
          },
          { new: true }
        );

        if (user.isEmailVerified) {
          await Device.findOneAndUpdate(
            { deviceId: headers.deviceId },
            { isVerified: true, isActive: true },
            { new: true }
          );

          sendPushPersonal(UserPush.EVENT_CREATE_ACCOUNT.key, user._id, {
            ...UserPush.EVENT_CREATE_ACCOUNT,
            message:
              "Welcome to Koboldo" + user.firstName + " " + user.lastName,
          });

          result = {
            message: "You've successfully signed up!",
          };
        } else {
          return await sendOtp(
            headers,
            {
              email: user.email,
              for: data.for,
            },
            { new: true }
          );
        }
      }
    } else if (data.for === Options.Auth.OtpFor.SIGN_IN) {
      if (data.email) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isEmailVerified: true,
          },
          { new: true }
        );
      } else {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isPhoneVerified: true,
          },
          { new: true }
        );

        if (user.is2FAEnabled || (isNewDevic && !data.email))
          return await sendOtp(headers, {
            email: user.email,
            for: data.for,
          });
      }

      // only either 2fa is disabled(and by default this verification is for phone)
      // or 2fa is enabled and current verification is for email (as: phone has been verified)
      if (!user.is2FAEnabled || data.email) {
        // activate sign-in on the requested device,
        let signUpDevice = user.devices.find((device) => {
          return device.isSignUp;
        });
        if (signUpDevice) {
          await Device.findByIdAndUpdate(
            signUpDevice._id,
            {
              isActive: true,
              isVerified: true,
              isSignUp: false,
            },
            { new: true }
          );
        }
        let device = await Device.findOneAndUpdate(
          { deviceId: headers.deviceId },
          {
            $inc: { jwtVersion: 1 },
            $set: {
              isVerified: true,
              isActive: true,
              lastLoggedInAt: Date(),
              location: data.device?.location || null,
              fcmToken: data.device?.fcmToken || null,
            },
          },
          { new: true }
        );

        if (isNewDevic) {
          sendPushPersonal(UserPush.EVENT_NEW_DEVICE_LOGIN.key, user._id, {
            ...UserPush.EVENT_NEW_DEVICE_LOGIN,
            message: `Your account has been logged in into ${device.deviceName} device`,
          });
        }

        result = {
          token: jwt.sign(
            {
              id: user._id,
              role: user.role,
              username: user.username,
              email: user.email,
              phone: user.phone,
              deviceId: device.deviceId,
              jwtVersion: device.jwtVersion,
            },
            process.env.JWT_SIGN,
            { expiresIn: `${process.env.JWT_EXPIRY}` || "1h" }
          ),
          user: await getDetailedUser(user._id, user.role),
        };
      }
    } else if (data.for === Options.Auth.OtpFor.FORGOT_USERNAME) {
      return { username: user.username };
    } else {
      if (data.email) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isEmailVerified: true,
          },
          { new: true }
        );
      } else {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            isPhoneVerified: true,
          },
          { new: true }
        );

        if (user.is2FAEnabled)
          return await sendOtp(headers, {
            email: user.email,
            for: Options.Auth.OtpFor.FORGOT_PASSWORD,
          });
      }

      if (!user.is2FAEnabled || data.email) {
        result = {
          username: user.username,
          email: user.email,
          phone: user.phone,
          userId: user._id,
        };
      }
    }

    return result;
  } catch (error) {
    console.log(`${TAG}.verifyOtp: `, error);
    return null;
  }
};

const forgotUsername = async (headers, data) => {
  try {
    const user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    return await sendOtp(headers, {
      for: Options.Auth.OtpFor.FORGOT_USERNAME,
      phone: user.phone,
    });
  } catch (error) {
    console.log(`${TAG}.forgotUsername: `, error);
    return null;
  }
};

const forgotPassword = async (headers, data) => {
  try {
    const user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    return await sendOtp(headers, {
      for: Options.Auth.OtpFor.FORGOT_PASSWORD,
      phone: user.phone,
    });
  } catch (error) {
    console.log(`${TAG}.forgotPassword: `, error);
    return null;
  }
};

const resetPassword = async (headers, data) => {
  try {
    const user = await User.findById(data.userId);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    let hashedPassword = await bcrypt.hash(data.password, 10);
    if (user.role === Options.User.Roles.ADMIN) {
      await Buyer.findByIdAndUpdate(user._id, { password: hashedPassword });
    } else if (user.role === Options.User.Roles.SELLER) {
      await Buyer.findByIdAndUpdate(user._id, { password: hashedPassword });
    } else {
      await Buyer.findByIdAndUpdate(user._id, { password: hashedPassword });
    }

    return {
      message: Auth.OK_PASSWORD_RESET,
    };
  } catch (error) {
    console.log(`${TAG}.resetPassword: `, error);
    return null;
  }
};

const sendOtp = async (headers, data) => {
  try {
    console.log(`${TAG}.sendOtp: `, data);

    const user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    let otp;
    if (data.email) {
      otp = await sendEmailOtp(user);
      return {
        email: user.email,
        message: Notify.OK_SEND_EMAIL_OTP,
      };
    } else {
      otp = await sendPhoneOtp(user);
      return {
        phone: user.phone,
        message: Notify.OK_SEND_PHONE_OTP,
      };
    }
  } catch (error) {
    console.log(`${TAG}.sendOtp: `, error);
    return null;
  }
};

const verifyAnswer = async (headers, data) => {
  try {
    let user = await getUser(data);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    // console.log(`${TAG}.verifyAnswer.userQuestions: `, user.securityAnswers);
    const selectedQuestion = user.securityAnswers.find((answer) => {
      return answer.questionId + "" === data.answer.questionId + "";
    });
    // console.log(`${TAG}.verifyAnswer.selectedQuestion: `, selectedQuestion);
    // console.log(`${TAG}.verifyAnswer.inAnswer: `, data.answer);
    if (selectedQuestion) {
      if (
        selectedQuestion.answer.toLowerCase() ===
        data.answer.answer.toLowerCase()
      ) {
        return {
          isCorrect: true,
          ...(await sendOtp(headers, {
            for: Options.Auth.OtpFor.SIGN_IN,
            phone: user.phone,
          })),
        };
      } else {
        return {
          isCorrect: false,
          message: Auth.NOT_ANSWER_CORRECT,
        };
      }
    } else {
      return {
        status: 900,
        message: Auth.NOT_QUESTION_FOUND,
      };
    }
  } catch (error) {
    console.log(`${TAG}.signIn: `, error);
    return null;
  }
};

module.exports = {
  createBuyer,
  createInfluencer,
  createSeller,
  createAdmin,
  checkUsername,

  signInByPassword,
  signInByOtp,
  verifyAnswer,

  resendOtp: sendOtp,
  verifyOtp,

  forgotUsername,
  forgotPassword,
  resetPassword,
};
