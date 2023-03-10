const {
  badRequestResponse,
  authFailureResponse,
} = require("../../utility/responses");
const { Auth } = require("../../utility/constants");
const { User } = require("../../api/user/common/schemas/user.schema");
const { Options } = require("../../utility/enums");

const checkUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return badRequestResponse(res, Auth.NOT_USER_EXISTS);
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`checkUser: `, error);
    return null;
  }
};

const isAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return badRequestResponse(res, Auth.NOT_USER_EXISTS);
    }

    if (user.role === Options.User.Roles.ADMIN) {
      req.user = user;
      next();
    } else {
      return authFailureResponse(res, Auth.ACCESS_ADMIN_ONLY);
    }
  } catch (error) {
    console.log(`checkUser: `, error);
    return null;
  }
};

module.exports = {
  checkUser,
  isAdmin,
};
