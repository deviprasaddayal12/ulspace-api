const { model, Schema } = require("mongoose");
const { Options } = require("../../../utility/enums");

const WaitingPeriodSchema = new Schema({
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
  timeUnit: {
    type: String,
    enum: Options.Units.Time,
  },
});

module.exports.WaitingPeriodSchema = WaitingPeriodSchema;
module.exports.WaitingPeriod = model("WaitingPeriod", WaitingPeriodSchema);

const ScheduleSchema = new Schema({
  duration: {
    type: Number,
  },
  timeUnit: {
    type: String,
    enum: Options.Units.Time,
  },
});

module.exports.ScheduleSchema = ScheduleSchema;
module.exports.Schedule = model("Schedule", ScheduleSchema);
