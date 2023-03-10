const { model, Schema, default: mongoose } = require("mongoose");

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      required: true,
    },
    replies: {
      type: [this.CommentSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports.CommentSchema = CommentSchema;
module.exports.Comment = model("Comment", CommentSchema);
