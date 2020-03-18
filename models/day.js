const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Joi = require("joi");
const promisify = require("util").promisify;

const hash = promisify(Bcrypt.hash);

const dayJoiFormat = Joi.object()
  .keys({
    date: Joi.string()
      .required(),
    events: Joi.array()
      .items(Joi.string()),
    users: Joi.array()
      .items(Joi.string())
      .required(),
    rating: Joi.number()
      .min(0)
      .max(10)
  })
  .unknown(true);

const mongoFormat = {
  date: {
    type: String,
    unique: true
  },
  events: {
    type: Array
  },
  users: {
    type: Array
  },
  rating: {
    type: Number
  }
};

const daySchema = new Mongoose.Schema(mongoFormat);

daySchema.pre("save", async function () {
  await Joi.validate(this, dayJoiFormat);
});

const Day = Mongoose.model("Day", daySchema);

module.exports = Day;