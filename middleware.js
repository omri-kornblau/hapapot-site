const Jwt = require("jsonwebtoken");
const Boom = require("boom");

const secretKey = require("./config/server").secretTokenKey;

exports.withAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw Boom.unauthorized("Unauthorized: No token provided");
  } else {
    try {
      const decoded = await Jwt.verify(token, secretKey)
      req.username = decoded.username;
      next();
    } catch (err) {
      throw Boom.unauthorized("Unauthorized: Invalid token");
    }
  }
}