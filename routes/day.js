const _ = require("lodash");
const Mongoose = require("mongoose");

const Utils = require("../utils");

const UserModel = Mongoose.model("User");
const DayModel = Mongoose.model("Day");

const emptyDay = {
  users: [],
  events: [],
  date: "",
  rating: 0
}

const getAndCreateIfEmpty = async date => {
  const day = await DayModel.findOne({
    date: Utils.dateToDayQuery(date)
  });
  if (!!day) {
    return day;
  }
  const newDay = _.cloneDeep(emptyDay);
  newDay.date = Utils.dateToDayQuery(date);
  return await DayModel.create(newDay);
}

exports.getDay = async (req, res) => {
  const {
    date
  } = req.params;
  const {
    username
  } = req;
  const day = await getAndCreateIfEmpty(date);
  const attending = _.includes(day.users, username);
  day.users = await UserModel.find({
    username: {
      $in: day.users
    }
  });

  res.send({
    day,
    attending
  });
}

exports.updateDayAttendancy = async (req, res) => {
  const {
    date
  } = req.params;
  const {
    attending
  } = req.body;
  const {
    username
  } = req;

  const day = await getAndCreateIfEmpty(date);
  const dbOperation = attending ? {
    $addToSet: {
      users: username
    }
  } : {
    $pull: {
      users: username
    }
  };

  await DayModel.update({
    date: Utils.dateToDayQuery(day.date)
  }, dbOperation);

  res.send();
}