const { model, Schema } = require("mongoose");

const MediaFileSchema = new Schema({
  mediaFile: {
    type: Buffer,
  },
  fileName: {
    type: String,
  },
});

module.exports.MediaFileSchema = MediaFileSchema;
module.exports.MediaFile = model("MediaFile", MediaFileSchema);
