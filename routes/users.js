const Mongoose = require('mongoose');
const Express = require('express');

const ErrorsHandler = require('./errors-handler')

const router = Express.Router()
const userModel = Mongoose.model('User');

router.get(`/user`, async (req, res) => {
  const users = await userModel.find();
  return res.send(users);
});

router.post(`/user`, async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    return res.status(201).send({
      error: false,
      user
    });
  } catch (err) {
    return ErrorsHandler.handle(res, err);
  }
});

module.exports = router