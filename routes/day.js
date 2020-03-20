const _ = require("lodash");
const Mongoose = require("mongoose");

const Utils = require("../utils");
const MongoHelpers = require("../models/mongoHelpers");

const UserModel = Mongoose.model("User");
const DayModel = Mongoose.model("Day");
const EventModel = Mongoose.model("Event");

exports.getDay = async (req, res) => {
  const {
    date
  } = req.params;
  const {
    username
  } = req;
  const day = await MongoHelpers.getAndCreateIfEmpty(date);
  const attending = _.includes(day.users, username);
  day.users = await UserModel.find({
    username: {
      $in: day.users
    }
  });

  day.events = await EventModel.find({
    eventId: {
      $in: day.events
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

  const day = await MongoHelpers.getAndCreateIfEmpty(date);
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