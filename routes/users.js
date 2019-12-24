const Mongoose = require('mongoose');
const Express = require('express');

const router = Express.Router()
const UserModel = Mongoose.model('User');

const sendUser = (res, status, userFromDb) => {
  res.status(status).send({
    error: false,
    user: userFromDb
  });
}

router.get(`/`, async (req, res) => {
  const { username } = req;
  const user = await UserModel.findOne({ username })
  return res.send(user);
});

router.post(`/`, async (req, res) => {
  const user = req.body;
  const existingUsers = await UserModel.find({ username: user.username });

  if (existingUsers.length > 0) {
    const updatedUser =
      await UserModel.updateOne({ username: user.username}, user);
    return sendUser(res, 204, updatedUser);
  }
  const createdUser = await UserModel.create(req.body);
  return sendUser(res, 201, createdUser);
});

module.exports = router