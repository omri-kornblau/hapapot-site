const _ = require("lodash");
const Mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const Boom = require("boom");

const Utils = require("../utils");

const UserModel = Mongoose.model("User");
const CookieModel = Mongoose.model("Cookie");

const {
  secretTokenKey,
  maxUserLogins
} = require("../config/server");

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

  const tokenPassword = Utils.getRandomPassword(16);
  const payload = {
    username,
    tokenPassword
  }
  const {
    stay
  } = req.query;
  const cookieAmount = await CookieModel.countDocuments({
    username
  });

  if (cookieAmount >= maxUserLogins) {
    const oldCookies =
      await CookieModel.find({
        username
      }).sort({
        _id: -1
      }).limit(maxUserLogins - cookieAmount + 1);
    const oldCookeiIds = oldCookies.map(cookie => cookie._id);
    await CookieModel.remove({
      _id: {
        $in: oldCookeiIds
      }
    });
  }
  await CookieModel.create(payload);
  const tokenOptions = stay ? null : {
    expiresIn: "12h"
  };
  const token = Jwt.sign(payload, secretTokenKey, tokenOptions);
  return res.cookie("token", token, {
    httpOnly: true
  }).send();
}

exports.checkToken = (req, res) => {
  res.send();
}

exports.logout = async (req, res) => {
  const token = req.cookies.token;
  const {
    username,
    tokenPassword
  } = await Jwt.verify(token, secretTokenKey)
  const userCookies = await CookieModel.find({
    username
  });
  const cookieValids = await Promise.all(userCookies.map(cookie =>
    cookie.isCorrectCookie(tokenPassword)
  ));
  // There will be at least one cookie because this
  // route has 'withAuth' middleware
  const foundCookieIdx = _.findIndex(cookieValids);
  await CookieModel.remove(userCookies[foundCookieIdx]);
  res.send();
}