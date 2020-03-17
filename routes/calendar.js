const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");
const moment = require("moment");

const Utils = require("../utils");

const DayModel = Mongoose.model("Day");
const UserModel = Mongoose.model("User");

const weeksToShow = 2;
const daysInWeek = 7;

const emptyDay = {
  attendance: 0,
  events: [],
  date: ""
}

const getCalendarDayFromDbDay = async (currentUser, dbDay, usersAmount) => {
  const {
    date,
    events,
    users
  } = dbDay;
  const attendance = 100 * (users.length / usersAmount);
  const attending = _.includes(users, currentUser);
  const nickNames = (await UserModel.find({
    username: {
      $in: users
    }
  })).map(user => user.nicknames);

  return {
    attendance,
    nickNames,
    date,
    events,
    attending
  };
}

exports.getCalendarChunk = async (req, res) => {
  const chunk = Number(req.params.chunk);
  const {
    username
  } = req;
  if (!Number.isInteger(chunk)) {
    Boom.badRequest("Given chunk is not an integer");
  }
  const startOfWeek = moment().startOf("week");
  const dateRangeStart = startOfWeek.clone()
    .subtract(chunk, "weeks");
  const dateRangeEnd = startOfWeek.clone()
    .add(daysInWeek * (weeksToShow - chunk) - 1, "days");
  const relevantDaysFromDb = await DayModel.find({
    date: {
      $gte: Utils.dateToDayQuery(dateRangeStart),
      $lte: Utils.dateToDayQuery(dateRangeEnd)
    }
  }).sort("date");
  const usersAmount = await UserModel.count();

  let dbDatesIndex = 0;
  const calendar =
    Promise.all(_.range(weeksToShow).map(weekIdx =>
      Promise.all(_.range(daysInWeek).map(async dayIdx => {
        const currentDbDay = relevantDaysFromDb[dbDatesIndex];
        const currentDay = _.clone(emptyDay);
        const currentCalDate = dateRangeStart.clone()
          .add(weekIdx * daysInWeek + dayIdx, "day");
        currentDay.date = Utils.dateToDayQuery(currentCalDate);
        if (!!currentDbDay) {
          if (currentCalDate.isSame(currentDbDay.date, "day")) {
            dbDatesIndex += 1;
            return getCalendarDayFromDbDay(username, currentDbDay, usersAmount);
          }
        }
        return currentDay;
      }))));

  res.send(await calendar);
}