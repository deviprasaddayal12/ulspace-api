const service = require("./security.service");
const responses = require("./../../../utility/responses");
// const Constants = require("../../../../utility/constants");

const createQuestion = async (req, res) => {
  try {
    const security = await service.createQuestion(req.body);
    return responses.successResponse(res, security);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getQuestions = async (req, res) => {
  try {
    const answer = await service.getQuestions();
    return responses.successResponse(res, answer);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const brand = await service.deleteQuestion(req.params.questionId);
    return responses.successResponse(res, brand);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  deleteQuestion,
};
