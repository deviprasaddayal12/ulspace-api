const Types = {
  Address: {
    HOME: "Home",
    OFFICE: "Office",
    OTHERS: "Others",
  },
  Device: {
    MOBILE: "PHONE",
    WEB: "WEB",
    TABLET: "TABLET",
  },
  PaymentMethods: {
    COD: "COD",
    DEBIT_CARD: "DC",
    CREDIT_CARD: "CC",
  },
  Buyer: {
    RETAIL: "Retail",
    BUSINESS: "Business",
  },
  Bags: {
    SM_STANDARD: "SM-STANDARD",
    SM_OPTIONS: "SM-OPTIONS",
    SM_BUNDLE: "SM-BUNDLE",
    BM_STANDARD: "BM-STANDARD",
    SD_STANDARD: "SD-STANDARD",
  },
  ShopMore: {
    ALL: "ALL",
    OPTIONS: "OPTIONS",
    COMBO: "COMBO",
  },
  SocialMedia: {
    FACEBOOK: "FACEBOOK",
    INSTAGRAM: "INSTAGRAM",
    TIKTOK: "TIKTOK",
    YOUTUBE: "YOUTUBE",
  },
};

const Status = {
  Request: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },
  Bag: {
    OPEN: "OPEN",
    CLOSED: "CLOSED",
  },
  BagOffer: {
    INCOMPLETE: "INCOMPLETE",
    ACTIVE: "ACTIVE",
    IN_PROCESS: "IN_PROCESS",
    CANCELLED: "CANCELLED",
  },
  Order: {
    Root: {
      CREATED: "CREATED",
      BOOKED: "BOOKED",
      PICK_RLS: "PICK_RELEASE",
      SHIP_CONFIRMED: "SHIP_CONFIRMED",
      SHIPPED: "SHIPPED",
      RETURNED: "RETURNED",
    },
    Buyer: {
      TRACK_ORDER: "TRACK_ORDER",
      TRACK_PACKAGE: "TRACK_PACKAGE",
    },
  },
  Return: {
    Root: {
      CREATED: "CREATED",
      BOOKED: "BOOKED",
      PICK_RLS: "PICK_RELEASE",
      SHIP_CONFIRMED: "SHIP_CONFIRMED",
      SHIPPED: "SHIPPED",
      REFUNDED: "REFUNDED",
    },
    Buyer: {
      TRACK_ORDER: "TRACK_ORDER",
      TRACK_PACKAGE: "TRACK_PACKAGE",
    },
  },
};

const Options = {
  Auth: {
    OtpFor: {
      SIGN_UP: "signUp",
      SIGN_IN: "signIn",
      FORGOT_PASSWORD: "forgotPassword",
      FORGOT_USERNAME: "forgotUsername",
      CHANGE_PASSWORD: "changePassword",
      CHANGE_EMAIL: "changeEmail",
      CHANGE_PHONE: "changePhone",
    },
  },
  User: {
    Gender: {
      MALE: "Male",
      FEMALE: "Female",
      OTHERS: "Others",
    },
    Roles: {
      BUYER: 1,
      SELLER: 2,
      ADMIN: 3,
      INFLUENCER: 4,
    },
    Levels: {
      BASIC: 1,
    },
  },
  Influencer: {
    Levels: {
      BASIC: 1,
    },
  },
  Units: {
    Time: ["HOURS", "DAYS", "WEEKS", "MONTHS"],
  },
};

const Sections = {
  Dashboard: {
    Banners: {
      SALES: "SALES",
      SEASONS: "SEASONS",
      ACCESSORIES: "ACCESSORIES",
      POPULAR_CATEGORIES: "POPULAR_CATEGORIES",
      FEATURED: "FEATURED",
    },
    Offers: {
      SHOP_NOW: "SHOP_NOW",
      ON_DISCOUNTS: "ON_DISCOUNTS",
      DEALS_OF_THE_DAY: "DEALS_OF_THE_DAY",
      SHOP_STYLES: "SHOP_STYLES",
    },
    Items: {
      TRENDING: "TRENDING",
      CLEARANCE: "CLEARANCE",
      SUGGESTIONS: "SUGGESTIONS",
      SEARCHED: "SEARCHED",
    },
    Featured: { ALL: "ALL" },
    ForYou: { ALL: "ALL" },
  },
};

module.exports = {
  Types,
  Status,
  Options,
  Sections,
};
