const { model, Schema } = require("mongoose");

const QuestionSchema = new Schema(
  {
    question: String,
  },
  { timestamps: true }
);

const AnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
    },
    answer: String,
  },
  { timestamps: true }
);

module.exports.QuestionSchema = QuestionSchema;
module.exports.Question = model("question", QuestionSchema);

module.exports.AnswerSchema = AnswerSchema;
module.exports.Answer = model("answer", AnswerSchema);
