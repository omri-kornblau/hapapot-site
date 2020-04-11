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
      const userCookie = await CookieModel.findOne({
        username
      });
      const isValid = await userCookie.isCorrectCookie(tokenPassword);
      if (isValid) {
        req.username = username;
        return next();
      }

      throw new Error();
    } catch (err) {
      throw Boom.unauthorized("Unauthorized: Invalid token");
    }
  }
}