const _ = require("lodash");
const Mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const Boom = require("boom");

const CookieModel = Mongoose.model("Cookie");

const secretKey = require("./config/server").secretTokenKey;

exports.withAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw Boom.unauthorized("Unauthorized: No token provided");
  } else {
    try {
      const {
        username,
        tokenPassword
      } = await Jwt.verify(token, secretKey)
      const userCookies = await CookieModel.find({
        username
      });
      const cookieValids = await Promise.all(userCookies.map(cookie =>
        cookie.isCorrectCookie(tokenPassword)
      ));
      if (_.some(cookieValids)) {
        req.username = username;
        return next();
      }

      throw Boom.unauthorized("Unauthorized: Invalid token");
    } catch (err) {
      throw Boom.unauthorized("Unauthorized: Invalid token");
    }
  }
}