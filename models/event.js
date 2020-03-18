const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Joi = require("joi");
const Utils = require("../utils")

const hash = promisify(Bcrypt.hash);

const singleCarJoiFormat = Joi.object().keys({
  driver: Joi.string(),
  passengers: Joi.array().items(Joi.string())
});

const carsJoiFormat = Joi.array().items(singleCarJoiFormat);

const singleUserItemJoiFormat = Joi.object().keys({
  name: Joi.string(),
  amount: joi.number().integer()
})

const singleItemJoiFormat = Joi.array().items({
  name: Joi.string(),
  neededamount: Joi.number().integer(),
  users: Joi.array().items(singleUserItemJoiFormat)
});

const itemsJoiFormat = Joi.object().pattern(
  Joi.any(),
  Joi.array().items(singleItemJoiFormat)
);

const eventJoiFormat = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  time: Joi.string().isoDate(),
  eventkey: Joi.string(),
  icon: Joi.string(),
  cars: carsJoiFormat,
  items: itemsJoiFormat,
  users: Joi.array().items(Joi.string()),
  description: Joi.string(),
  rating: Joi.number()
});

const mongoFormat = {
  _id: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  time: {
    type: String
  },
  eventKey: {
    type: String
  },
  icon: {
    type: String
  },
  cars: {
    type: Array
  },
  items: {
    type: Array
  },
  users: {
    type: Array
  },
  description: {
    type: String
  },
  rating: {
    type: Number
  }
};

const eventSchema = new Mongoose.Schema(mongoFormat);

eventSchema.pre("save", async function () {
  await Joi.validate(this, eventJoiFormat);
  const {
    time,
    name
  } = this;

  const date = Utils.dateToDayQuery(time);
  event._id = `${date}_${name}`;

  if (!event.eventkey) {
    event.eventkey = await hash(event.name + time);
  }
});

const Event = Mongoose.model("Event", daySchema);

module.exports = Event;