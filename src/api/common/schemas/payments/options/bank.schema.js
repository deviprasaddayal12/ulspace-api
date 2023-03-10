const { model, Schema, default: mongoose } = require("mongoose");
const { Types } = require("../../../../../utility/enums");
const { CurrencySchema } = require("../../currency.schema");

const BankFieldSchema = new Schema(
  {
    labelText: {
      type: String,
    },
    hintText: {
      type: String,
    },
    fieldType: {
      type: String,
    },
    fieldGroup: {
      type: String,
    },
    validation: {
      type: {
        min: {
          type: Number,
        },
        max: {
          type: Number,
        },
        regex: {
          type: String,
        },
      },
    },
  },
  { timestamps: false }
);

module.exports.BankFieldSchema = BankFieldSchema;
module.exports.BankField = model("BankField", BankFieldSchema);

const BankConfigSchema = new Schema(
  {
    currency: {
      type: CurrencySchema,
    },
    bankName: {
      type: BankFieldSchema,
    },
    locIdentifier: {
      type: BankFieldSchema,
    },
    accountType: {
      type: BankFieldSchema,
    },
    accountNumber: {
      type: BankFieldSchema,
    },
    accountHolder: {
      type: BankFieldSchema,
    },
    accountHolderId: {
      type: BankFieldSchema,
    },
    addtionals: {
      type: [BankFieldSchema],
    },
  },
  { timestamps: true }
);

module.exports.BankConfigSchema = BankConfigSchema;
module.exports.BankConfig = model("BankConfig", BankConfigSchema);

const BankSchema = new Schema(
  {
    bankConfigId: {
      type: mongoose.Types.ObjectId,
      ref: "BankConfig",
    },
    bankName: {
      type: String,
    },
    locIdentifier: {
      type: String,
    },
    accountType: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    accountHolder: {
      type: String,
    },
    accountHolderId: {
      type: String,
    },
    additionals: {
      type: [
        {
          fieldId: String,
          fieldValue: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports.BankSchema = BankSchema;
module.exports.Bank = model("Bank", BankSchema);
