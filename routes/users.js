const Mongoose = require('mongoose');
const Express = require('express')

const router = Express.Router()
const userModel = Mongoose.model('User');

router.get(`/user`, async (req, res) => {
  const users = await userModel.find();
  return res.send(users);
});

router.post(`/user`, async (req, res) => {
  const user = await userModel.create(req.body);
  return res.status(201).send({
    error: false,
    user
  });
});

router.put(`/user/:id`, async (req, res) => {
  const {id} = req.params;
  const user = await userModel.findByIdAndUpdate(id, req.body);
  return res.status(202).send({
    error: false,
    user
  });
});

router.delete(`/user/:id`, async (req, res) => {
  const {id} = req.params;
  const user = await userModel.findByIdAndDelete(id);
  return res.status(202).send({
    error: false,
    user
  });
});

module.exports = router