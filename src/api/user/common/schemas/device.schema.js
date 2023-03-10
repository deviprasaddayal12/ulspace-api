const { model, Schema, default: mongoose } = require("mongoose");
const { Types } = require("../../../../utility/enums");

const DeviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
      enum: {
        values: Object.values(Types.Device),
      },
    },
    location: {
      type: Object,
      required: true,
    },
    fcmToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    isSignUp: {
      type: Boolean,
    },
    isVerified: {
      type: Boolean,
    },
    jwtVersion: {
      type: Number,
      default: 1,
    },
    lastLoggedInAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports.DeviceSchema = DeviceSchema;
module.exports.Device = model("Device", DeviceSchema);
