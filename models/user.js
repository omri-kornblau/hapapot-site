const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const promisify = require('util').promisify;

const hashCompare = promisify(Bcrypt.compare);
const hash = promisify(Bcrypt.hash);
// Used for hashing
const saltRounds = 10;

const joiFormat = Joi.object().keys({
  username: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20)
}).unknown(true);

const mongoFormat = {
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String }
}

const userSchema = new Mongoose.Schema(mongoFormat);

userSchema.pre('save', async function() {
  await Joi.validate(this, joiFormat);
  this.password = await hash(this.password, saltRounds);
});

userSchema.methods.isCorrectPassword = async function(password) {
  return await hashCompare(password, this.password);
}

module.exports = Mongoose.model('User', userSchema);
