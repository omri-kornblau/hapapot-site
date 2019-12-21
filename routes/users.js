const Mongoose = require('mongoose');
const Express = require('express');

const router = Express.Router()
const UserModel = Mongoose.model('User');

router.get(`/user`, async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

router.post(`/user`, async (req, res) => {
  const user = await UserModel.create(req.body);
  return res.status(201).send({
    error: false,
    user
  });
});

module.exports = router