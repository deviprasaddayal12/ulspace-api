const { model, Schema, default: mongoose } = require("mongoose");

const PaymentSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "Buyer",
    },
    mode: {
      type: String,
    },
    billingId: {
      type: Schema.Types.ObjectId,
      ref: "BillingAddress",
    },
    token: {
      type: String,
    },
    amount: {
      type: Number,
    },
    breakup: {
      type: Object,
    },
    invoive: {
      type: String,
    },
    status: {
      type: String,
      default: "SUCCESS",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports.PaymentSchema = PaymentSchema;
module.exports.Payment = model("Payment", PaymentSchema);
