const { model, Schema } = require("mongoose");

const BaseSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  deletedAt: {
    type: Number,
    min: 0,
  },
  updatedAt: {
    type: Number,
    min: 0,
  },
  createdAt: {
    type: Date,
  },
});

module.exports.BaseSchema = BaseSchema;
module.exports.Base = model("Base", BaseSchema);
