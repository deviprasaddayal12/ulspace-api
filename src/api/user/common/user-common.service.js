const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { Options } = require("../../../utility/enums");
const { Notify, Auth, UserMsgs } = require("../../../utility/constants");
const {
  sendPhoneOtp,
  sendEmailOtp,
} = require("../../../utility/notifications");
const { User } = require("./../common/schemas/user.schema");
const { MediaFile } = require("./../../common/schemas/file.schema");
const { Device } = require("./../common/schemas/device.schema");
const {
  ChangePassword,
  ChangePhone,
  ChangeEmail,
} = require("./../common/schemas/change-request.schema");
const { UserPush } = require("../../../notifications/push.event-message");
const { sendPushPersonal } = require("../../../notifications/push.main");

const TAG = "users.service";

const getDetailedUser = async (userId, role = Options.User.Roles.BUYER) => {
  if (role == Options.User.Roles.BUYER)
    return await Buyer.findById(userId)
      .select("-password")
      .populate([
        "devices",
        "paymentMethods",
        "shippingAddresses",
        "wishlist",
        "watchlistBags",
        "profile",
      ]);
  else if (role == Options.User.Roles.INFLUENCER)
    return await Influencer.findById(userId)
      .select("-password")
      .populate("profile targetCategories");
  else
    return await User.findById(userId).select("-password").populate("profile");
};

const getAdmin = async (userId) => {
  return await getDetailedUser(userId, Options.User.Roles.ADMIN);
};

const getBuyer = async (userId) => {
  return await getDetailedUser(userId, Options.User.Roles.BUYER);
};

const getInfluencer = async (userId) => {
  return await getDetailedUser(userId, Options.User.Roles.INFLUENCER);
};

const getSeller = async (userId) => {
  return await getDetailedUser(userId, Options.User.Roles.SELLER);
};

const getAllUsers = async (offset, limit) => {
  try {
    return await User.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
  } catch (error) {
    console.log(`${TAG}.getAllUsers: `, error);
    return null;
  }
};

const updateUser = async (userId, body) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { ...body },
      { new: true }
    );

    sendPushPersonal(
      UserPush.EVENT_UPDATE_ACCOUNT.key,
      userId,
      UserPush.EVENT_UPDATE_ACCOUNT
    );

    return await getDetailedUser(userId, user.role);
  } catch (error) {
    console.log(`${TAG}.updateUser: `, error);
    return null;
  }
};

const updateProfile = async (userId, bufferedFile) => {
  try {
    let mediaFile = await MediaFile.create({
      mediaFile: await Buffer.from(bufferedFile.buffer),
      fileName: bufferedFile.originalName,
    });

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { profile: mediaFile._id },
      { new: true }
    );

    return await getDetailedUser(userId, user.role);
  } catch (error) {
    console.log(`${TAG}.updateProfile: `, error);
    return null;
  }
};

const deleteUser = async (userId) => {
  try {
    return await User.findByIdAndRemove(userId, { new: true });
  } catch (error) {
    console.log(`${TAG}.deleteUser: `, error);
    return null;
  }
};

const changePassword = async (headers, userId, data) => {
  try {
    let user = await User.findById(userId).populate("devices");
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    let { currentPassword, newPassword } = data;

    let match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return {
        status: 900,
        message: Auth.NOT_PASSWORD_CORRECT,
      };
    }

    await ChangePassword.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        userId: user._id,
        newPassword: newPassword,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await sendPhoneOtp(user);
    return {
      phone: user.phone,
      message: Notify.OK_SEND_PHONE_OTP,
    };
  } catch (e) {
    console.log(`${TAG}.changePassword: `, e);
    return null;
  }
};

const changePhone = async (headers, userId, data) => {
  try {
    let user = await User.findById(userId).populate("devices");
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    const users = await User.find({
      phone: data.newPhone,
    });
    if (users && users.length) {
      return {
        status: 900,
        message: UserMsgs.PHONE_EXISTS_ALREADY,
      };
    }

    await ChangePhone.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        userId: user._id,
        newPhone: data.newPhone,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await sendEmailOtp(user);
    return {
      email: user.email,
      message: Notify.OK_SEND_EMAIL_OTP,
    };
  } catch (e) {
    console.log(`${TAG}.changePhone: `, e);
    return null;
  }
};

const changeEmail = async (headers, userId, data) => {
  try {
    let user = await User.findById(userId).populate("devices");
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    const users = await User.find({
      email: data.newEmail,
    });
    if (users && users.length) {
      return {
        status: 900,
        message: UserMsgs.EMAIL_EXISTS_ALREADY,
      };
    }

    await ChangeEmail.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        userId: user._id,
        currentEmail: user.email,
        newEmail: data.newEmail,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await sendPhoneOtp(user);
    return {
      phone: user.phone,
      message: Notify.OK_SEND_PHONE_OTP,
    };
  } catch (e) {
    console.log(`${TAG}.changeEmail: `, e);
    return null;
  }
};

const verifyOtp = async (headers, userId, data) => {
  try {
    let result = {};

    let user = await User.findById(userId);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    if (data.otp !== "123456") {
      return {
        status: 900,
        message: Auth.NOT_OTP_CORRECT,
        data: { isOtpCorrect: false },
      };
    }

    if (data.for === Options.Auth.OtpFor.CHANGE_PASSWORD) {
      let changeRequest = await ChangePassword.findOne({
        userId: user._id,
      });

      if (data.target === user.phone) {
        if (user.is2FAEnabled) {
          await sendEmailOtp(user);
          return {
            email: user.email,
            message: Notify.OK_SEND_EMAIL_OTP,
          };
        }
      }

      const hashedNewPasssword = bcrypt.hashSync(changeRequest.newPassword, 10);
      user = await User.findByIdAndUpdate(
        userId,
        {
          password: hashedNewPasssword,
        },
        { new: true }
      );

      sendPushPersonal(
        UserPush.EVENT_PASSWORD_CHANGE.key,
        userId,
        UserPush.EVENT_PASSWORD_CHANGE
      );

      // TODO: logout from all devices
      return {
        message:
          "You've successfully changed your password! Please logout and login again.",
      };
    } else if (data.for === Options.Auth.OtpFor.CHANGE_PHONE) {
      let changeRequest = await ChangePhone.findOne({
        userId: user._id,
      });

      if (data.target === user.email) {
        await sendPhoneOtp({ phone: changeRequest.newPhone });
        return {
          phone: changeRequest.newPhone,
          message: Notify.OK_SEND_PHONE_OTP,
        };
      } else if (data.target === changeRequest.newPhone) {
        user = await User.findByIdAndUpdate(
          userId,
          {
            phone: changeRequest.newPhone,
          },
          { new: true }
        );

        sendPushPersonal(
          UserPush.EVENT_PHONE_CHANGE.key,
          userId,
          UserPush.EVENT_PHONE_CHANGE
        );

        return {
          message: "You've successfully changed your phone.",
        };
      } else {
        return {
          message: "Invalid verification request.",
        };
      }
    } else if (data.for === Options.Auth.OtpFor.CHANGE_EMAIL) {
      let changeRequest = await ChangeEmail.findOne({
        userId: user._id,
      });

      if (data.target === user.phone) {
        await sendEmailOtp({ email: changeRequest.newEmail });
        return {
          email: changeRequest.newEmail,
          message: Notify.OK_SEND_EMAIL_OTP,
        };
      } else if (data.target === changeRequest.newEmail) {
        user = await User.findByIdAndUpdate(
          userId,
          {
            email: changeRequest.newEmail,
          },
          { new: true }
        );

        sendPushPersonal(
          UserPush.EVENT_EMAIL_CHANGE.key,
          userId,
          UserPush.EVENT_EMAIL_CHANGE
        );

        return {
          message: "You've successfully changed your email.",
        };
      } else {
        return {
          message: "Invalid verification request.",
        };
      }
    }

    return result;
  } catch (error) {
    console.log(`${TAG}.verifyOtp: `, error);
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
        email: data.email,
        message: Notify.OK_SEND_EMAIL_OTP,
      };
    } else {
      otp = await sendPhoneOtp(user);
      return {
        phone: data.phone,
        message: Notify.OK_SEND_PHONE_OTP,
      };
    }
  } catch (error) {
    console.log(`${TAG}.sendOtp: `, error);
    return null;
  }
};

const deleteDevice = async (req) => {
  try {
    let device = await Device.findOne({
      deviceId: req.params.deviceId,
    });
    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          devices: device._id,
        },
      },
      { new: true }
    );
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    return {
      message: UserMsgs.DEVICE_DELETED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(`${TAG}.sendOtp: `, error);
    return null;
  }
};

const refreshToken = async (req) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    let device = await Device.findOneAndUpdate(
      { deviceId: req.headers.deviceId },
      {
        $inc: { jwtVersion: 1 },
      },
      { new: true }
    );

    return {
      refreshedToken: jwt.sign(
        {
          id: user._id,
          role: user.role,
          usernae: user.username,
          email: user.email,
          phone: user.phone,
          jwtVersion: device.jwtVersion,
        },
        process.env.JWT_SIGN,
        { expiresIn: `${process.env.JWT_EXPIRY}` || "1h" }
      ),
    };
  } catch (error) {
    console.log(`${TAG}.refreshToken: `, error);
    return null;
  }
};

const logout = async (req) => {
  try {
    const user = await User.findById(req.userId).populate("devices");
    if (!user) {
      return {
        status: 900,
        message: Auth.NOT_USER_EXISTS,
      };
    }

    const devices = user.devices;
    console.log(req.query);
    if (req.query.fromAll && req.query.fromAll === "true") {
      console.log("all");
      await Promise.all(
        devices.map(async (device) => {
          return await Device.findByIdAndUpdate(
            device._id,
            {
              isActive: false,
              isSignUp: false,
              $inc: { jwtVersion: 1 },
            },
            { new: true }
          );
        })
      );
    } else {
      const fromDeviceId = req.query.deviceId || req.headers.deviceId;
      console.log("logout from: ", fromDeviceId);
      await Promise.all(
        devices.map(async (device) => {
          if (device.deviceId === fromDeviceId)
            await Device.findByIdAndUpdate(
              device._id,
              {
                isActive: false,
                isSignUp: false,
                $inc: { jwtVersion: 1 },
              },
              { new: true }
            );
        })
      );
    }

    return { message: "You've been logged out successfully!" };
  } catch (error) {
    console.log(`${TAG}.logout: `, error);
    return null;
  }
};

module.exports = {
  getDetailedUser,
  getAdmin,
  getBuyer,
  getInfluencer,
  getSeller,
  getAllUsers,
  updateUser,
  updateProfile,
  deleteUser,
  changePassword,
  changePhone,
  changeEmail,
  resendOtp: sendOtp,
  verifyOtp,
  deleteDevice,
  refreshToken,
  logout,
};
