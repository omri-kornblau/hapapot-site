const Mongoose = require("mongoose");
const Joi = require("joi");
const Utils = require("../utils")
const MongoHelpers = require("./mongoHelpers")

const DayModel = Mongoose.model("Day");

const promisify = require("util").promisify;

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
  description: Joi.string().required(),
  icon: Joi.string(),
  cars: Joi.array().items(carJoiFormat),
  items: Joi.array().items(itemJoiFormat),
  users: Joi.array().items(Joi.string()),
  rating: Joi.number()
}).unknown(true);

const mongoFormat = {
  name: {
    type: String
  },
  time: {
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
});

eventSchema.post("save", async function () {
  const {
    time
  } = this;

  const date = Utils.dateToDayQuery(time);

  await MongoHelpers.getAndCreateIfEmpty(date);
  await DayModel.updateOne({
    date
  }, {
    $addToSet: {
      events: this._id
    }
  });
});

eventSchema.pre("remove", async function () {
  const {
    time
  } = this;
  const date = Utils.dateToDayQuery(time);

  await DayModel.updateOne({
    date
  }, {
    $pull: {
      events: this._id
    }
  });
});

const Event = Mongoose.model("Event", eventSchema);

module.exports = Event;