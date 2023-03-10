const { model, Schema, default: mongoose } = require("mongoose");
const { Types } = require("../../../utility/enums");

const AddressSchema = new Schema(
  {
    isDefault: {
      type: Boolean,
      default: false,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    addressType: {
      type: String,
      enum: Object.values(Types.Address),
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    address3: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postal: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    landline: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports.AddressSchema = AddressSchema;
const Address = model("Address", AddressSchema);
module.exports.Address = Address;

const ShippingAddressSchema = new Schema({
  deliveryInstructions: {
    type: String,
    required: false,
  },
});

module.exports.ShippingAddressSchema = ShippingAddressSchema;
module.exports.ShippingAddress = Address.discriminator(
  "ShippingAddress",
  ShippingAddressSchema
);

const BillingAddressSchema = new Schema({
  sendInvoice: {
    type: Boolean,
    default: true,
    required: false,
  },
});

module.exports.BillingAddressSchema = BillingAddressSchema;
module.exports.BillingAddress = Address.discriminator(
  "BillingAddress",
  BillingAddressSchema
);

const ReturnAddressSchema = new Schema({
  zonalCode: {
    type: String,
    required: true,
  },
});

module.exports.ReturnAddressSchema = ReturnAddressSchema;
module.exports.ReturnAddress = Address.discriminator(
  "ReturnAddress",
  ReturnAddressSchema
);
