const Jwt = require('jsonwebtoken');
const Boom = require('boom');

const handleErrors = require('./routes/errors-handler');

const secretKey = require('./config/server').secretTokenKey;

exports.withAuth = handleErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw Boom.unauthorized('Unauthorized: No token provided');
  } else {
    try {
      const decoded = await Jwt.verify(token, secretKey)
      req.email = decoded.email;
      next();
    } catch (err) {
      throw Boom.unauthorized('Unauthorized: Invalid token');
    }
  }
});
