const { initializeApp } = require("firebase-admin/app");
var admin = require("firebase-admin");
var fcmKey = require("./fcm.key-dev.json");
const { User } = require("../api/user/common/schemas/user.schema");

const TAG = "push.main";

admin.initializeApp({
  credential: admin.credential.cert(fcmKey),
});

const sendPushPersonal = async (eventType, userId, payload) => {
  try {
    const devices = (await User.findById(userId).populate("devices")).devices;
    const activeDevices = devices.filter((d) => d.isActive);
    const tokens = activeDevices.map((device) => {
      return device.fcmToken != null && device.fcmToken;
    });
    console.log(`${TAG}.sendPushPersonal ${eventType}: device=`, tokens);
    if (tokens && tokens.length > 0) {
      const message = await admin.messaging().sendToDevice(tokens, {
        data: payload,
        notification: {
          title: payload?.title ?? "",
          body: payload.message,
        },
      });
      console.log(`${TAG}.sendPushPersonal: `, message);
    }
  } catch (error) {
    console.log(`${TAG}.sendPushPersonal: error=`, error);
  }
};

const sendPushGroup = async (eventType, userIds, payload) => {
  try {
    const devices = (await User.findById(userId).populate("devices")).devices;
    //   console.log(`${TAG}.sendPushGroup: devices=`, devices);
    const activeDevices = devices.filter((d) => d.isActive);
    console.log(`${TAG}.sendPushGroup: device=`, activeDevices);
    const tokens = activeDevices.map((device) => {
      return device.fcmToken != null && device.fcmToken;
    });
    if (tokens && tokens.length > 0) {
      const message = await admin.messaging().sendToDeviceGroup();
      console.log(`${TAG}.sendPushGroup: `, message);
    }
  } catch (error) {
    console.log(`${TAG}.sendPushGroup: error=`, error);
  }
};

const sendPushBusiness = async (eventType, payload) => {
  try {
    const devices = (await User.findById(userId).populate("devices")).devices;
    //   console.log(`${TAG}.sendPushBusiness: devices=`, devices);
    const activeDevices = devices.filter((d) => d.isActive);
    console.log(`${TAG}.sendPushBusiness: device=`, activeDevices);
    const tokens = activeDevices.map((device) => {
      return device.fcmToken != null && device.fcmToken;
    });
    if (tokens && tokens.length > 0) {
      const message = await admin.messaging().sendToTopic();
      console.log(`${TAG}.sendPushBusiness: `, message);
    }
  } catch (error) {
    console.log(`${TAG}.sendPushBusiness: error=`, error);
  }
};

module.exports = {
  sendPushPersonal,
  sendPushGroup,
  sendPushBusiness,
};
