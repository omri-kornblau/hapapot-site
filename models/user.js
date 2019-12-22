const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const Boom = require('boom');
const promisify = require('util').promisify;

const hashCompare = promisify(Bcrypt.compare);
const hash = promisify(Bcrypt.hash);
// Used for hashing
const saltRounds = 10;

const joiFormat = Joi.object().keys({
  username: Joi.string().required().min(3).max(20),
  password: Joi.string().required().min(6).max(20),
  birthday: Joi.string().isoDate().required(),
  single: Joi.boolean().required(),
  cartype: Joi.number().integer(),
  nickname: Joi.array().items(Joi.string()),
  picture: Joi.string()
}).unknown(true);

const mongoFormat = {
  username: { type: String, unique: true },
  password: { type: String },
  birthday: { type: String },
  single: { type: Boolean },
  cartype: { type: Number },
  nickname: { type: Array },
  picture: { type: String }
}

const userSchema = new Mongoose.Schema(mongoFormat);

userSchema.pre('save', async function() {
  await Joi.validate(this, joiFormat);
  this.password = await hash(this.password, saltRounds);
});

userSchema.methods.isCorrectPassword = async function(password) {
  console.log(this.password, password);
  return await hashCompare(password, this.password);
}

const User = Mongoose.model('User', userSchema);

module.exports = User;
