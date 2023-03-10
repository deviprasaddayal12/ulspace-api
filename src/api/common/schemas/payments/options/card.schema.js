const { model, Schema } = require("mongoose");
const { Types } = require("../../../../../utility/enums");

const CardSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(Types.PaymentMethods),
    },
    cardNo: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    expDate: {
      type: String,
      required: true,
    },
    cardNickname: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports.CardSchema = CardSchema;
module.exports.Card = model("Card", CardSchema);
