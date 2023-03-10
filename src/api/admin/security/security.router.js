const express = require("express");
const controller = require("./security.controller");

const router = express.Router();

router.post("/", controller.createQuestion);
router.get("/", controller.getQuestions);
router.delete("/:questionId", controller.deleteQuestion);

module.exports = router;
