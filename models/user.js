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
  nicknames: Joi.array().items(Joi.string()),
  picture: Joi.string(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  aboutme: Joi.string()
}).unknown(true);

const mongoFormat = {
  username: { type: String, unique: true },
  password: { type: String },
  birthday: { type: String },
  single: { type: Boolean },
  cartype: { type: Number },
  nicknames: { type: Array },
  picture: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  aboutme: { type: String }
}

const userSchema = new Mongoose.Schema(mongoFormat);

userSchema.pre('save', async function() {
  await Joi.validate(this, joiFormat);
  this.password = await hash(this.password, saltRounds);
});

userSchema.methods.isCorrectPassword = async function(password) {
  return await hashCompare(password, this.password);
}

const User = Mongoose.model('User', userSchema);

module.exports = User;
