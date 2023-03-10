const Joi = require("joi");
const { Options, Types } = require("../utility/enums");

// primitive validations
const JoiPhoneProp = Joi.extend(require("joi-phone-number"));
const StrReqProp = Joi.string().required();
const NumReqProp = Joi.number().required();
const BoolReqProp = Joi.boolean().required();
const ObjectIdProp = Joi.string().hex().length(24);

// master validations
const S3ObjectProp = Joi.object().allow();
const CountryProp = Joi.string().max(2).uppercase();
const CurrencyProp = Joi.object().allow();
const UnitProp = Joi.object().allow();

// address validations
const AddressProp = Joi.object().keys({
  isDefault: Joi.boolean().optional(),
  firstName: StrReqProp,
  lastName: StrReqProp,
  addressType: Joi.string().valid(...Object.values(Types.Address)),
  address1: StrReqProp,
  address2: Joi.string().optional().allow(""),
  address3: Joi.string().optional().allow(""),
  city: StrReqProp,
  state: StrReqProp,
  postal: StrReqProp,
  country: StrReqProp,
  phone: StrReqProp,
  landline: Joi.string().optional().allow(""),
});
const ShippingProp = AddressProp.keys({
  deliveryInstructions: Joi.string().optional().allow(""),
});
const CardProp = Joi.object().keys({
  type: Joi.string().valid(...Object.values(Types.PaymentMethods)),
  cardNo: StrReqProp,
  cardName: StrReqProp,
  expDate: StrReqProp,
  cardNickname: Joi.string().optional(),
  companyName: StrReqProp,
  cvv: Joi.number().required().min(111).max(999),
});
const PaymentMethodProp = Joi.object().keys({
  isDefault: Joi.boolean().optional(),
  method: CardProp,
  billingAddress: AddressProp,
});

// security validations
const DeviceProp = Joi.object().keys({
  deviceId: StrReqProp,
  deviceName: StrReqProp,
  deviceType: StrReqProp.valid(...Object.values(Types.Device)),
  fcmToken: StrReqProp,
  location: Joi.object().keys({
    lat: NumReqProp,
    lng: NumReqProp,
    place: StrReqProp,
  }),
});
const OtpProp = Joi.string().min(6).max(6).required();
const OtpForProp = Joi.string().valid(
  "signIn",
  "signUp",
  "forgotPassword",
  "forgotUsername",
  "changePassword",
  "changeEmail",
  "changePhone"
);
const QuestionProp = Joi.object().allow();
const AnswerProp = Joi.object({
  questionId: ObjectIdProp,
  answer: StrReqProp,
});

// request validations
const HeaderProp = Joi.object({
  locale: CountryProp.required(),
  deviceId: Joi.string().alphanum().max(50).required(),
  lan: StrReqProp,
});

// user validations
const RoleProp = Joi.number().valid(...Object.values(Options.User.Roles));
const NameProp = Joi.string().max(40);
const PhoneProp = JoiPhoneProp.string().phoneNumber();
const EmailProp = Joi.string().email();
const GenderProp = Joi.string().valid(...Object.values(Options.User.Gender));
const UsernameProp = Joi.string().alphanum().min(3).max(20);
const PasswordProp = Joi.string().regex(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
);
const AgeGroupProp = Joi.object().allow();
const IncomeLevelProp = Joi.object().allow();
const UserProp = Joi.object().keys({
  role: RoleProp.required(),
  firstName: NameProp.required(),
  lastName: NameProp.required(),
  phone: PhoneProp.required(),
  email: EmailProp.required(),
  gender: GenderProp.required(),
  country: CountryProp.required(),
  username: UsernameProp.required(),
  password: PasswordProp.required(),
  securityAnswers: Joi.array().items(AnswerProp.required()).required(),
  profile: S3ObjectProp.optional(),
  ageGroup: AgeGroupProp.optional(),
  profile: Joi.binary().optional(),
});
const BuyerProp = UserProp.keys({
  device: DeviceProp.required(),
  incomeLevel: IncomeLevelProp.optional(),
  paymentMethods: Joi.array().items(PaymentMethodProp.optional()).optional(),
  shippingAddresses: Joi.array().items(ShippingProp.optional()).optional(),
});
const InfluencerProp = UserProp.keys({
  request: StrReqProp,
  displayName: StrReqProp,
  aboutMe: StrReqProp,
  targetAgeGroups: Joi.array()
    .items(AgeGroupProp.optional())
    .optional()
    .default([]),
  targetCategories: Joi.array()
    .items(Joi.string().optional())
    .optional()
    .default([]),
  personalBlogs: Joi.array()
    .items(Joi.string().optional())
    .optional()
    .default([]),
  paymentMethods: Joi.array().items(PaymentMethodProp.optional()).optional(),
  device: DeviceProp.optional(),
});
// const SellerProp = UserProp.object({});
// const AdminProp = UserProp.object({});

// brand validations
const BrandProp = Joi.object().allow();

// attribute validations
const AttributeProp = Joi.object().allow();

// category validatons
const CategoryProp = Joi.object().allow();

// product validations
const PriceProp = Joi.object().allow();
const WaitingPeriodProp = Joi.object().allow();
const ProductPriceProp = Joi.object().allow();
const ProductProp = Joi.object().allow();
const AvailabilityProp = Joi.object().allow();

// bag validations
const BagItemProp = Joi.object().allow();
const BagProp = Joi.object().allow();
const OfferProp = Joi.object().allow();

const AuthValidation = {
  usernameAvailability: Joi.object({
    username: UsernameProp,
  }),

  signUpBuyer: BuyerProp,
  signUpInfluencer: InfluencerProp,

  signInByPassword: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    username: UsernameProp,
    password: PasswordProp,
    device: Joi.alternatives().conditional("email", {
      is: process.env.SUPER_ADMIN_USERNAME,
      then: DeviceProp.optional(),
      otherwise: DeviceProp.required(),
    }),
  }).or("email", "phone", "username"),
  signInByOtp: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    username: UsernameProp,
    device: DeviceProp.required(),
  }).or("email", "phone", "username"),
  verifyAnswer: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    username: UsernameProp,
    answer: AnswerProp,
  }).or("email", "phone", "username"),

  sendOtp: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    username: UsernameProp,
    for: OtpForProp,
  }).or("email", "phone", "username"),
  verifyOtp: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    otp: OtpProp,
    for: OtpForProp,
    device: DeviceProp.optional(),
  }).or("email", "phone"),

  forgotUsername: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
  }).or("email", "phone"),
  forgotPassword: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
    username: UsernameProp,
  }).or("email", "phone", "username"),
  resetPassword: Joi.object({
    userId: ObjectIdProp,
    password: PasswordProp,
  }),
};

const UserValidation = {
  getDetails: Joi.object({
    userId: ObjectIdProp,
  }),

  update: Joi.object({
    user_id: ObjectIdProp,
  }).unknown(true),
  delete: Joi.object({
    user_id: ObjectIdProp,
  }),
  getAll: Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
  }),

  changePassword: Joi.object({
    currentPassword: PasswordProp,
    newPassword: PasswordProp,
  }),
  changeEmail: Joi.object({
    newEmail: EmailProp,
  }),
  changePhone: Joi.object({
    newPhone: PhoneProp,
  }),

  addShippingAddress: ShippingProp,
  editShippingAddress: ShippingProp.fork(
    Object.keys(ShippingProp.describe().keys),
    (key) => key.optional()
  ),
  addPaymentMethod: PaymentMethodProp,
  editPaymentMethod: Joi.object().keys({
    isDefault: Joi.boolean().optional(),
    method: CardProp.fork(Object.keys(CardProp.describe().keys), (key) =>
      key.optional()
    ),
    billingAddress: AddressProp.fork(
      Object.keys(AddressProp.describe().keys),
      (key) => key.optional()
    ),
  }),

  sendOtp: Joi.object({
    email: EmailProp,
    phone: PhoneProp,
  }).or("email", "phone"),
  verifyOtp: Joi.object({
    target: StrReqProp,
    otp: OtpProp,
    for: OtpForProp,
  }),

  deleteDevice: Joi.object({
    deviceId: StrReqProp,
  }),

  logout: Joi.object({
    fromAll: BoolReqProp.optional(),
    deviceId: Joi.string().optional(),
  }),
};

const attrSchemas = {
  post: Joi.object({}).unknown(true),
  put: Joi.object({}).unknown(true),
  get: Joi.object({}).unknown(true),
  getById: Joi.object({}).unknown(true),
  delete: Joi.object({}).unknown(true),
};

const PriceSchemas = {
  createNewPricing: Joi.object({
    minimumOfferPrice: Joi.number().required(),
    onlineMinPrice: Joi.number().required(),
    onlineMaxPrice: Joi.number().required(),
    currency: StrReqProp,
  }),
  getAllPricing: Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
  }),
  getPricing: Joi.object({
    pricingId: ObjectIdProp,
  }),
  updatePricing: Joi.object({
    pricingId: ObjectIdProp,
  }),
  deletePricing: Joi.object({
    pricingId: ObjectIdProp,
  }),
};

const categories = {
  create: Joi.object({
    name: StrReqProp,
    parentPath: Joi.string().allow("").optional().default(null),
    code: StrReqProp,
    attributeKeys: StrReqProp,
    filterable: Joi.boolean(),
  }),
  all: Joi.object({
    limit: Joi.number().optional().default(100),
    offset: Joi.number().optional().default(0),
    parent: Joi.string().optional().default(""),
  }),
  byId: Joi.object({
    categoryId: ObjectIdProp,
  }),
  update: Joi.object({
    categoryId: ObjectIdProp,
  }),
  delete: Joi.object({
    categoryId: ObjectIdProp,
  }),
};

const productSchemas = {
  createNewProduct: Joi.object({
    name: StrReqProp,
    brand: StrReqProp,
    shortDescription: StrReqProp,
    longDescription: StrReqProp,
    category: StrReqProp,
    sku: StrReqProp,
  }),
  getAllProducts: Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
  }),
  getProducts: Joi.object({ productId: ObjectIdProp }),
  updateProducts: Joi.object({ productId: ObjectIdProp }),
  deleteProducts: Joi.object({ productId: ObjectIdProp }),
};

const brandsSchema = {
  createNewBrands: Joi.object({
    name: StrReqProp,
    description: StrReqProp,
  }),
  getAllBrands: Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
  }),
  getBrand: Joi.object({
    brandId: ObjectIdProp,
  }),
  updateBrand: Joi.object({
    brandId: ObjectIdProp,
  }),
  deleteBrand: Joi.object({
    brandId: ObjectIdProp,
  }),
};

const countrySchema = {
  getCountries: Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
  }),
};

const unitSchema = {
  post: Joi.object({
    dimen: StrReqProp,
    value: StrReqProp,
  }),
  put: Joi.object({}).unknown(true),
  get: Joi.object({}),
  getById: Joi.object({
    unitId: ObjectIdProp,
  }),
  delete: Joi.object({
    unitId: ObjectIdProp,
  }),
};

const seller = {};

module.exports = {
  AuthValidation,
  UserValidation,
  attrSchemas,
  PriceSchemas,
  categories,
  productSchemas,
  brandsSchema,
  countrySchema,
  unitSchema,
  seller,
};
