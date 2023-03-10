const { model, Schema } = require("mongoose");
const { CurrencySchema } = require("./currency.schema");

const PriceSchema = new Schema({
  currency: {
    // type: CurrencySchema,
    type: String,
  },
  priceValue: {
    type: Number,
    min: [0, "minimum price value cannot be negative"],
  },
});

module.exports.PriceSchema = PriceSchema;
module.exports.Price = model("Price", PriceSchema);
