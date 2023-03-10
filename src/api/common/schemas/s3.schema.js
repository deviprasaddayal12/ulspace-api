const { model, Schema } = require("mongoose");

const S3Schema = new Schema({
  location: {
    type: String,
  },
  etag: {
    type: String,
  },
  apiKey: {
    type: String,
  },
});

module.exports.S3Schema = S3Schema;
module.exports.S3Object = model("S3Object", S3Schema);
