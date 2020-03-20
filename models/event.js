const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Joi = require("joi");
const Utils = require("../utils")
const MongoHelpers = require("./mongoHelpers")

const DayModel = Mongoose.model("Day");

const promisify = require("util").promisify;

const hash = promisify(Bcrypt.hash);
// Used for hashing
const saltRounds = 10;

const carJoiFormat = Joi.object().keys({
  driver: Joi.string(),
  passengers: Joi.array().items(Joi.string())
});

const userInItemJoiFormat = Joi.object().keys({
  name: Joi.string(),
  amount: Joi.number().integer()
})

const itemJoiFormat = Joi.array().items({
  name: Joi.string(),
  neededamount: Joi.number().integer(),
  users: Joi.array().items(userInItemJoiFormat)
});

const eventJoiFormat = Joi.object().keys({
  name: Joi.string().required(),
  time: Joi.string().required(),
  eventkey: Joi.string(),
  icon: Joi.string(),
  cars: Joi.array().items(carJoiFormat),
  items: Joi.array().items(itemJoiFormat),
  users: Joi.array().items(Joi.string()),
  description: Joi.string(),
  rating: Joi.number()
}).unknown(true);

const mongoFormat = {
  eventId: {
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
  },
  attending: {
    type: Boolean
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
  this.eventId = `${date}_${name}`;

  if (!this.eventkey) {
    this.eventkey = await hash(this.eventId, saltRounds);
  }

  await MongoHelpers.getAndCreateIfEmpty(date);

  await DayModel.updateOne({
    date: date
  }, {
    $addToSet: {
      events: this.eventId
    }
  })
});

eventSchema.pre("save", async function () {
  const {
    time,
    name
  } = this;
  const date = Utils.dateToDayQuery(time);
  const eventId = `${date}_${name}`;

  await DayModel.updateOne({
    date: date
  }, {
    $pull: {
      events: eventId
    }
  })
});

const Event = Mongoose.model("Event", eventSchema);

module.exports = Event;