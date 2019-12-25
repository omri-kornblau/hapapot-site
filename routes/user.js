const Mongoose = require('mongoose');

const UserModel = Mongoose.model('User');

const sendUser = (res, status, userFromDb) => {
  res.status(status).send({
    error: false,
    user: userFromDb
  });
}

exports.getUser = async (req, res) => {
  const { username } = req;
  const user = await UserModel.findOne({ username })
  return res.send(user);
}

exports.upsertUser = async (req, res) => {
  const user = req.body;
  const existingUsers = await UserModel.find({ username: user.username });

  if (existingUsers.length > 0) {
    const updatedUser =
      await UserModel.updateOne({ username: user.username}, user);
    return sendUser(res, 204, updatedUser);
  }
  const createdUser = await UserModel.create(req.body);
  return sendUser(res, 201, createdUser);
}

exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
}