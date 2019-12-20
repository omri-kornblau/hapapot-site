const Mongoose = require('mongoose');
const Express = require('express');
const Jwt = require('jsonwebtoken');

const withAuth = require('../middleware').withAuth;

const router = Express.Router();
const userModel = Mongoose.model('User');

const secretKey = 'hapapotsecretkey';

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.boom.badRequest('Incorrect email or password');
  } else {
    const isCorrect = await user.isCorrectPassword(password);
    if (!isCorrect) {
      return res.boom.badRequest('Incorrect email or password');
    } else {
      // Issue token
      const payload = { email };
      const token = Jwt.sign(payload, secretKey, {
        expiresIn: '1h'
      });
      return res.cookie('token', token, { httpOnly: true }).send();
    }
  }
});

router.get('/checktoken', withAuth, (req, res) => {
  res.send();
});

module.exports = router;