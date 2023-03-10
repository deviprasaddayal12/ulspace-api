const { Guard } = require("../../utility/constants");
const {
  badRequestResponse,
  internalFailureResponse,
} = require("../../utility/responses");

const TAG = "headers.guard";

const checkOptionalHeaders = (req, res, next) => {
  try {
    if (req.body.email == process.env.SUPER_ADMIN_USERNAME) {
      return next();
    }

    if (req.headers.deviceid)
      req.headers.deviceId = req.headers.deviceid.trim();

    console.log(`${TAG}.checkOptionalHeaders: `, req.headers.deviceId);
    next();
  } catch (err) {
    return internalFailureResponse(res, Guard.ERR_HEADERS_UNKNOWN);
  }
};

const checkHeaders = (req, res, next) => {
  try {
    if (req.body.email == process.env.SUPER_ADMIN_USERNAME) {
      return next();
    }

    const { locale, lan, deviceid, deviceId } = req.headers;
    if (!locale) return badRequestResponse(res, Guard.MISSING_LOCALE);
    if (!lan) return badRequestResponse(res, Guard.MISSING_LAN);
    if (!deviceid && !deviceId)
      return badRequestResponse(res, Guard.MISSING_DEVICE);
    else {
      if (req.headers.deviceid)
        req.headers.deviceId = req.headers.deviceid.trim();
    }

    next();
  } catch (err) {
    return internalFailureResponse(res, Guard.ERR_HEADERS_UNKNOWN);
  }
};

module.exports = {
  checkOptionalHeaders,
  checkHeaders,
};
