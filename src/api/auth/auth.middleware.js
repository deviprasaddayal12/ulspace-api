const responses = require("../../utility/responses");
const { User } = require("../user/common/schemas/user.schema");

const userExists = async (req, res, next) => {
  let { email } = req.body;

  //* enter an email
  if (email) {
    //find if user exists
    let status = await User.find({ email: email });
    //*if user exists
    if (status.length > 0) {
      //throw error
      return responses.authFailureResponse(
        res,
        "User already registered with this email address"
      );
    } else {
      //proceed
      next();
    }
  } else {
    return responses.authFailureResponse(res, "please enter your email");
  }
};

const emailExists = async (req, res, next) => {
  let { email } = req.body;

  //* enter an email
  if (email) {
    //find if email input exists
    let status = await User.find({ email: email });
    //*if email exists
    if (status.length > 0) {
      //email exists
      next();
    } else {
      //email does not exist
      return responses.authFailureResponse(
        res,
        "no user associated with this email"
      );
    }
  } else {
    return responses.authFailureResponse(res, "please enter your email");
  }
};

const emailValidity = async (req, res, next) => {
  let { email } = req.body;

  //* enter an email
  if (email) {
    //find if email input exists
    let status = await User.find({ email: email, isEmailVerified: true });

    if (status.length > 0) {
      //email exists
      //email does not exist
      return responses.authFailureResponse(
        res,
        "this email is already validated"
      );
    } else {
      next();
    }
  } else {
    return responses.authFailureResponse(res, "please enter your email");
  }
};

module.exports = {
  userExists,
  emailExists,
  emailValidity,
};
