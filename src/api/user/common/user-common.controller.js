const service = require("./user-common.service");

const responses = require("../../../utility/responses");
const { UserMsgs } = require("../../../utility/constants");

const TAG = "user.controller";

const getAllUsers = async (req, res) => {
  try {
    const { offset, limit } = req.query;
    let users = await service.getAllUsers(offset, limit);

    return responses.successResponse(res, users);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getUser = async (req, res) => {
  try {
    let profile = await service.getDetailedUser(req.userId, req.payload.role);

    return responses.successResponse(res, profile);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await service.updateUser(req.userId, req.body);

    return responses.successResponse(res, user);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateProfile = async (req, res) => {
  console.log(req.file);
  try {
    let user = await service.updateProfile(req.userId, req.file);

    return responses.successResponse(res, user);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await service.deleteUser(req.userId);

    return responses.successResponse(res, user);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await service.changePassword(
      req.headers,
      req.userId,
      req.body
    );
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, null, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const changeEmail = async (req, res) => {
  try {
    const result = await service.changeEmail(req.headers, req.userId, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, null, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const changePhone = async (req, res) => {
  try {
    const result = await service.changePhone(req.headers, req.userId, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, null, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const resendOtp = async (req, res) => {
  try {
    const result = await service.resendOtp(req.headers, req.body);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, null, result.message);
    }

    return responses.successResponse(res, result.message);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const result = await service.verifyOtp(req.headers, req.userId, req.body);
    console.log(`${TAG}.verifyOtp: `, result);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.data, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const deleteDevice = async (req, res) => {
  try {
    if (req.params.deviceId === req.headers.deviceId) {
      return responses.successResponse(
        res,
        null,
        UserMsgs.CANT_DELETE_CURRENT_DEVICE
      );
    }

    const result = await service.deleteDevice(req);
    if (result.status && result.status !== 200) {
      return responses.successResponse(res, result.data, result.message);
    }

    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await service.refreshToken(req);
    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const logout = async (req, res) => {
  try {
    const result = await service.logout(req);
    return responses.successResponse(res, result);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  getUser,
  updateUser,
  updateProfile,
  deleteUser,
  getAllUsers,
  changePassword,
  changeEmail,
  changePhone,
  resendOtp,
  verifyOtp,
  deleteDevice,
  refreshToken,
  logout,
};
