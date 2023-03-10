const express = require("express");
const {
  validateEntry,
  validateEntryOptional,
} = require("../../middlewares/guards/entry.guard");

const router = express.Router();

router.use("/common", validateEntry, require("./common/user-common.router"));

module.exports = router;
