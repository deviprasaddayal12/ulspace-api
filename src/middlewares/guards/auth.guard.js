const jwt = require("jsonwebtoken");
const { Device } = require("../../api/user/common/schemas/device.schema");
const { Options } = require("../../utility/enums");
const { authFailureResponse } = require("../../utility/responses");

const TAG = "auth.guard";

const checkOptionalToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization && !req.headers.Authorization) return next();

    const auth = req.headers.authorization || req.headers.Authorization;
    const token = auth.split(" ")[1];
    const result = await jwt.verify(token, process.env.JWT_SIGN, {
      complete: true,
    });
    // console.log(TAG, result);

    if (result.payload) {
      let payload = result.payload;

      // TODO: add device id comparision between headers and token
      const device = await Device.findOne({
        deviceId: req.headers.deviceId,
      });
      // if (
      //   payload.role !== Options.User.Roles.ADMIN &&
      //   payload.jwtVersion !== device.jwtVersion
      // )
      //   return authFailureResponse(
      //     res,
      //     "Token has expired! Please signin again."
      //   );

      req.payload = payload;
      if (payload.role) req.role = payload.role;
      if (payload.id) req.userId = payload.id;

      console.log(`${TAG}.checkOptionalToken: `, req.userId);
      next();
    } else {
      return next();
    }
  } catch (err) {
    console.log(TAG, err.message);
    return next();
  }
};

const checkToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization && !req.headers.Authorization)
      return authFailureResponse(res, "Please provide bearer token!");

    const auth = req.headers.authorization || req.headers.Authorization;
    const token = auth.split(" ")[1];
    const result = await jwt.verify(token, process.env.JWT_SIGN, {
      complete: true,
    });
    // console.log(result);

    if (result.payload) {
      let payload = result.payload;

      // TODO: add device id comparision between headers and token
      const device = await Device.findOne({
        deviceId: req.headers.deviceId || req.headers.deviceid,
      });
      // console.log(payload);
      // console.log(device, req.headers);
      // if (
      //   payload.role !== Options.User.Roles.ADMIN &&
      //   payload.jwtVersion !== device.jwtVersion
      // )
      //   return authFailureResponse(
      //     res,
      //     "Token has expired! Please signin again."
      //   );

      req.payload = payload;
      req.userId = payload.id;
      next();
    } else {
      return authFailureResponse(res);
    }
  } catch (err) {
    console.log("auth.guard: ", err.message);
    return authFailureResponse(
      res,
      err.message
        ? err.message.includes("expired")
          ? "Token has expired! Please signin again."
          : err.message.includes("malformed")
          ? "You've entered an invalid token!"
          : "Either token is invalid or has expired!"
        : "Either token is invalid or has expired!"
    );
  }
};

module.exports = {
  checkOptionalToken,
  checkToken,
};
