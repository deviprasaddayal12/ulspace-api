const { model, Schema, default: mongoose } = require("mongoose");
var bcrypt = require("bcryptjs");
const {
  AnswerSchema,
} = require("../../../admin/security/schemas/question.schema");
const { Options } = require("../../../../utility/enums");
const { PriceSchema } = require("../../../common/schemas/price.schema");
const { S3Schema } = require("../../../common/schemas/s3.schema");

const baseOptions = {
  discriminatorKey: "userInfo",
};

const AgeGroupSchema = new Schema({
  minAge: {
    type: Number,
  },
  maxAge: {
    type: Number,
  },
});

module.exports.AgeGroupSchema = AgeGroupSchema;
module.exports.AgeGroup = model("AgeGroup", AgeGroupSchema);

const IncomeLevelSchema = new Schema({
  minIncome: {
    type: PriceSchema,
  },
  maxIncome: {
    type: PriceSchema,
  },
});

const UserSchema = new Schema(
  {
    role: {
      type: Number,
      enum: {
        values: Object.values(Options.User.Roles),
        message: `Incorrect role! It should be one of ${Object.values(
          Options.User.Roles
        )}`,
      },
    },
    profile: {
      type: S3Schema,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    ageGroup: {
      type: AgeGroupSchema,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(Options.User.Gender),
        message: `Incorrect gender! It should be one of ${Object.values(
          Options.User.Gender
        )}`,
      },
    },
    incomeLevel: {
      type: IncomeLevelSchema,
    },
    country: {
      type: Object,
    },
    language: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      minlenght: 8,
      required: true,
    },
    // tmpPassword: {
    //   type: String,
    // },
    securityAnswers: {
      type: [AnswerSchema],
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    devices: {
      type: [Schema.Types.ObjectId],
      ref: "Device",
    },
    is2FAEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
  baseOptions
);

UserSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) {
        return next(err);
      } else {
        this.password = hashed;
        return next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.findByAny = async function (data) {
  return await User.findOne({
    $or: [
      { username: data.username },
      { email: data.email },
      { phone: data.phone },
    ],
  });
};

module.exports.UserSchema = UserSchema;
module.exports.User = model("User", UserSchema);
