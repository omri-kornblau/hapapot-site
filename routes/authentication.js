const Mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const Boom = require("boom");

const Utils = require("../utils");

const UserModel = Mongoose.model("User");
const CookieModel = Mongoose.model("Cookie");

const secretKey = require("../config/server").secretTokenKey;

exports.register = async (req, res) => {
  const {
    username,
    password
  } = req.body;
  const user = await UserModel.findOne({
    username
  });
  if (!user) {
    throw Boom.badRequest("Incorrect username or password", {
      appCode: 2100
    });
  }
  const isCorrect = await user.isCorrectPassword(password);
  if (!isCorrect) {
    throw Boom.badRequest("Incorrect username or password", {
      appCode: 2200
    });
  }

  // Issue token
  const tokenPassword = Utils.getRandomPassword(16);
  const payload = {
    username,
    tokenPassword
  }
  await CookieModel.remove({
    username
  });
  await CookieModel.create(payload);
  const token = Jwt.sign(payload, secretKey, {
    expiresIn: "1h"
  });
  return res.cookie("token", token, {
    httpOnly: true
  }).send();
}

exports.checkToken = (req, res) => {
  res.send();
}