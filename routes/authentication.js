const Mongoose = require('mongoose');
const Jwt = require('jsonwebtoken');
const Boom = require('boom');

const UserModel = Mongoose.model('User');

const secretKey = require('../config/server').secretTokenKey;

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    throw Boom.badRequest('Incorrect username or password');
  }
  const isCorrect = await user.isCorrectPassword(password);
  if (!isCorrect) {
    throw Boom.badRequest('Incorrect username or password');
  }
  // Issue token
  const payload = { username };
  const token = Jwt.sign(payload, secretKey, {
    expiresIn: '1h'
  });
  return res.cookie('token', token, { httpOnly: true }).send();
}

exports.checkToken = (req, res) => {
  res.send();
}
