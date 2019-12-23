const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const promisify = require('util').promisify;

const hash = promisify(Bcrypt.hash);

const carsJoiFormat = Joi.object().pattern(
  Joi.any(), Joi.array().items(Joi.string())
);

const singleItemJoiFormat = Joi.object().keys({
  users: Joi.object().pattern(Joi.any(), Joi.number().integer()),
  amount: Joi.number().integer()
});

const itemsJoiFormat = Joi.object().pattern(
  Joi.any(), Joi.array().items(singleItemJoiFormat)
);

const eventJoiFormat = Joi.object().keys({
  name: Joi.string().required(),
  time: Joi.string().isoDate(),
  eventkey: Joi.string(),
  icon: Joi.string(),
  cars: carsJoiFormat,
  items: itemsJoiFormat,
  moneylink: Joi.string().uri()
});

const dayJoiFormat = Joi.object().keys({
  date: Joi.string().isoDate().required(),
  events: Joi.array().items(eventJoiFormat).required(),
  users: Joi.array().items(Joi.string()).required(),
  rating: Joi.number().min(0).max(10)
}).unknown(true);

const mongoFormat = {
  date: { type: String, unique: true },
  events: { type: Array },
  users: { type: String },
  rating: { type: Number }
}

const daySchema = new Mongoose.Schema(mongoFormat);

daySchema.pre('save', async function() {
  await Joi.validate(this, dayJoiFormat);
  const { date } = this;
  this.events.forEach(event => {
    if (!event.eventkey) {
      event.eventkey = await hash(event.name + date);
    }
  });
});

const Day = Mongoose.model('Day', daySchema);

module.exports = Day;
