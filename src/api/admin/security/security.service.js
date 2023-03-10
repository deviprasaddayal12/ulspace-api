const mongoose = require("mongoose");
const { Question } = require("./schemas/question.schema");

const createQuestion = async (data) => {
  try {
    return await Question.create({ ...data });
  } catch (err) {
    return null;
  }
};

const getQuestions = async () => {
  try {
    return await Question.find();
  } catch (err) {
    return null;
  }
};

const deleteQuestion = async (questionId) => {
  try {
    return await Question.findByIdAndDelete(questionId, { new: true });
  } catch (err) {
    return null;
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  deleteQuestion,
};
