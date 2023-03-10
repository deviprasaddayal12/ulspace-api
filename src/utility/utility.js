const { Options } = require("./enums");

module.exports = {
  onDbOpFailed: (message, status = 900) => {
    return {
      status: status,
      error: message,
    };
  },
  randomString: (
    length = 2,
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  getPosition: (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  },
  getScaledDate: (scale, unit, from, ahead = true) => {
    try {
      let fromDate = new Date();
      if (from) fromDate = new Date(from);

      if (unit == "HOURS") {
        fromDate.setHours(
          ahead ? fromDate.getHours() + scale : fromDate.getHours() - scale
        );
      } else if (unit == "DAYS") {
        fromDate.setDate(
          ahead ? fromDate.getDate() + scale : fromDate.getDate() - scale
        );
      } else if (unit == "WEEKS") {
        fromDate.setDate(
          ahead
            ? fromDate.getDate() + scale * 7
            : fromDate.getDate() - scale * 7
        );
      } else if (unit == "MONTHS") {
        fromDate.setMonth(
          ahead ? fromDate.getMonth() + scale : fromDate.getMonth() - scale
        );
      }

      return fromDate;
    } catch (error) {
      console.log("utils.getScaledDate: ", error);
    }
  },
};
