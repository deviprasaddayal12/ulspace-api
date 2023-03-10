const router = require("express").Router();

const { validateAdmin } = require("../middlewares/guards/entry.guard");
const { checkHeaders } = require("./../middlewares/guards/headers.guard");

router.use("/auth", checkHeaders, require("./auth/auth.router"));
router.use("/user", require("./user/user.router"));
router.use("/common", require("./common/common.router"));

module.exports = router;
