const { model, Schema } = require("mongoose");

const CurrencySchema = new Schema({
  name: {
    type: String,
  },
  shortForm: {
    type: String,
  },
  ascii: {
    type: String,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
  },
});

module.exports.CurrencySchema = CurrencySchema;
module.exports.Currency = model("Currency", CurrencySchema);
