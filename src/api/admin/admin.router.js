const express = require("express");
const { validateAdmin } = require("../../middlewares/guards/entry.guard");
const router = express.Router();

router.use("/security", validateAdmin, require("./security/security.router"));

module.exports = router;
