const Jwt = require('jsonwebtoken');

const secretKey = 'hapapotsecretkey';

exports.withAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.boom.unauthorized('Unauthorized: No token provided');
  } else {
    try {
      const decoded = await Jwt.verify(token, secretKey)
      req.email = decoded.email;
      next();
    } catch (err) {
      return res.boom.unauthorized('Unauthorized: Invalid token');
    }
  }
}
