const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");

const UserModel = Mongoose.model("User");

const ServerConfig = require("../config/server");

const sendUser = (res, status, userFromDb) => {
  user = _.clone(userFromDb);
  user.password = '';
  res.status(status).send({
    error: false,
    user: userFromDb
  });
}

const handleErrors = err => {
  if (err.code === 11000) {
    throw Boom.badRequest("username already exists", {
      appCode: 1100
    });
  }
  throw err;
}

exports.getUser = async (req, res) => {
  const {
    username
  } = req;
  const user = await UserModel.findOne({
    username
  })
  return sendUser(res, 200, user);
}

exports.insertUser = async (req, res) => {
  if (req.body.code !== ServerConfig.registrationCode) {
    throw Boom.badRequest("Wrong registration code");
  }

  try {
    delete req.body.code;
    const createdUser = await UserModel.create(req.body);
    return sendUser(res, 201, createdUser);
  } catch (err) {
    handleErrors(err);
  }
}

exports.upsertUser = async (req, res) => {
  const user = req.body;
  const existingUsers = await UserModel.find({
    username: user.username
  });

  if (existingUsers.length > 0) {
    try {
      const updatedUser =
        await UserModel.updateOne({
          username: user.username
        }, {
          $set: {
            'nicknames': user.nicknames,
            'birthday': user.birthday,
            'single': user.single,
            'aboutme': user.aboutme,
            'firstname': user.firstname,
            'lastname': user.lastname,
          }
        });
      return sendUser(res, 204, updatedUser);
    } catch (err) {
      handleErrors(err);
    }
  }
}

exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
}