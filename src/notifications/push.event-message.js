module.exports = {
  UserPush: {
    EVENT_CREATE_ACCOUNT: {
      key: "EVENT_CREATE_ACCOUNT",
      message: "Welcome to Koboldo {{username}}",
      title: "Account",
      variables: ["username"],
    },
    EVENT_NEW_DEVICE_LOGIN: {
      key: "EVENT_NEW_DEVICE_LOGIN",
      message: "Your account has been logged in into new {{device}} device.",
      title: "Security",
      variables: ["device"],
    },
    EVENT_ADD_WISHLIST_ITEM: {
      key: "EVENT_ADD_WISHLIST_ITEM",
      message: "Product has been added to your wishlist",
      title: "Wishlist",
    },
    EVENT_ADD_WATCHLIST_ITEM: {
      key: "EVENT_ADD_WATCHLIST_ITEM",
      message: "Bag has been added to your watchlist",
      title: "Watchlist",
    },
    EVENT_ADD_SHIPPING_ADDRESS: {
      key: "EVENT_ADD_SHIPPING_ADDRESS",
      message: "New shipping address has been added",
      title: "Account",
    },
    EVENT_ADD_PAYMENT_METHOD: {
      key: "EVENT_ADD_PAYMENT_METHOD",
      message: "New payment method has been added",
      title: "Account",
    },
    EVENT_PASSWORD_CHANGE: {
      key: "EVENT_PASSWORD_CHANGE",
      message: "Password has been changed!",
      title: "Security",
    },
    EVENT_PHONE_CHANGE: {
      key: "EVENT_PHONE_CHANGE",
      message: "Phone number has been changed!",
      title: "Security",
    },
    EVENT_EMAIL_CHANGE: {
      key: "EVENT_EMAIL_CHANGE",
      message: "Email has been changed!",
      title: "Security",
    },
    EVENT_UPDATE_ACCOUNT: {
      key: "EVENT_UPDATE_ACCOUNT",
      message: "Your account details has been updated!",
      title: "Account",
    },
  },

  BagsPush: {
    EVENT_NEW_BAG: {
      key: "EVENT_NEW_BAG",
      message: "You've created a new bag {{endson}}",
      title: "Collection",
      variables: ["endson"].join(),
    },
    EVENT_CONFIRM_OFFER: {
      key: "EVENT_CONFIRM_OFFER",
      message: "You've confirmed offer on a bag",
      title: "Collection",
    },
    EVENT_ROLLBACK_OFFER: {
      key: "EVENT_ROLLBACK_OFFER",
      message: "You've confirmed offer on a bag",
      title: "Collection",
    },
  },

  OrdersPush: {
    EVENT_NEW_ORDER: {
      key: "EVENT_NEW_ORDER",
      message: "Your order created successfully",
      title: "Order",
    },
    EVENT_RETURN_ORDER: {
      key: "EVENT_RETURN_ORDER",
      message: "Your return created successfully",
      title: "Order",
    },
    EVENT_STATUS_UPDATE: {
      key: "EVENT_STATUS_UPDATE",
      message: "Your order status updated to {{status}}",
      title: "Order",
      variables: ["status"],
    },
  },
};
