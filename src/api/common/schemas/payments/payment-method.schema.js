const { model, Schema, default: mongoose } = require("mongoose");
const { AddressSchema } = require("../address.schema");
const { CardSchema, Card } = require("./options/card.schema");
const { BankSchema } = require("./options/bank.schema");

const PaymentMethodSchema = new Schema(
  {
    isDefault: {
      type: Boolean,
      default: false,
      required: false,
    },
    method: {
      required: true,
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (value) {
          return typeof value === "card" || typeof value === "bank";
        },
        message: "method must be a card or bank",
      },
    },
    billingAddress: {
      type: AddressSchema,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports.PaymentMethodSchema = PaymentMethodSchema;
module.exports.PaymentMethod = model("PaymentMethod", PaymentMethodSchema);
