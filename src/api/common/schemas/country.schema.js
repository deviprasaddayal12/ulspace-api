const { model, Schema } = require("mongoose");

const CountrySchema = new Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
  },
});

module.exports.CountrySchema = CountrySchema;
module.exports.Country = model("Country", CountrySchema);
