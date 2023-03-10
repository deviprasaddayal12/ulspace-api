const { checkHeaders, checkOptionalHeaders } = require("./headers.guard");
const { checkToken, checkOptionalToken } = require("./auth.guard");
const { isAdmin } = require("./user.guard");

const validateEntry = async (req, res, next) => {
  await checkHeaders(req, res, async () => {
    await checkToken(req, res, next);
  });
};

const validateEntryOptional = async (req, res, next) => {
  await checkOptionalHeaders(req, res, async () => {
    await checkOptionalToken(req, res, next);
  });
};

const validateAdmin = async (req, res, next) => {
  await checkHeaders(req, res, async () => {
    await checkToken(req, res, async () => {
      await isAdmin(req, res, next);
    });
  });
};

module.exports = {
  validateEntry,
  validateEntryOptional,
  validateAdmin,
};
