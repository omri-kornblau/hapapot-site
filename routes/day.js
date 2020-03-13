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
  const day = await getAndCreateIfEmpty(date);
  const usersData = await Promise.all(
    day.users.map(async user => {
      const userFromDb = await UserModel.findOne({
        username: user
      });
      if (!userFromDb) {
        throw new Error(`No such username in DB [${user}]`);
      }
      return userFromDb.nicknames[0];
    })
  );
  day.users = usersData;

  res.send(day);
}

exports.attendDay = async (req, res) => {
  const {
    date
  } = req.params;
  const {
    username
  } = req;
  const day = await getAndCreateIfEmpty(date);
  await DayModel.update({
    date: Utils.dateToDayQuery(day.date)
  }, {
    $addToSet: {
      users: username
    }
  });

  res.send();
}

exports.absentDay = async (req, res) => {
  const {
    date
  } = req.params;
  const {
    username
  } = req;
  const day = await getAndCreateIfEmpty(date);
  await DayModel.updateOne({
    date: Utils.dateToDayQuery(day.date)
  }, {
    $pull: {
      users: username
    }
  }, {
    multi: true
  });

  res.send();
}