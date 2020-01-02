const _ = require('lodash');
const Mongoose = require('mongoose');
const Boom = require('boom');
const moment = require('moment');

const DayModel = Mongoose.model('Day');
const UserModel = Mongoose.model('User');

const weeksToShow = 2;
const daysInWeek = 7;

const emptyDay = {
  attendance: 0,
  events: [],
  date: ""
}

const getCalendarDayFromDbDay = (dbDay, usersAmount) => {
  const attendance = 100 * (dbDay.users.length / usersAmount);
  const { date, events } = dbDay;
  return { attendance, date, events };
}

exports.getCalendarChunk = async (req, res) => {
  const chunk = Number(req.params.chunk);
  if (!Number.isInteger(chunk)) {
    Boom.badRequest('Given chunk is not an integer');
  }
  const startOfWeek = moment().startOf('week');
  const dateRangeStart = startOfWeek.clone()
    .subtract(chunk, 'weeks');
  const dateRangeEnd = startOfWeek.clone()
    .add(daysInWeek*(weeksToShow - chunk) - 1, 'days');
  const relevantDaysFromDb = await DayModel.find({
    date: {
      $gte: dateRangeStart.toISOString(),
      $lt: dateRangeEnd.toISOString()
    }
  }).sort('date');
  const usersAmount = await UserModel.count();

  let dbDatesIndex = 0;
  const calendar =
    _.range(weeksToShow).map(__ =>
      _.range(daysInWeek).map(__ => {
        const currentDbDay = relevantDaysFromDb[dbDatesIndex];
        const currentCalDate = dateRangeStart.add(1, 'day');
        const currentDay = _.clone(emptyDay)
        currentDay.date = currentCalDate.toISOString();
        if (!!currentDbDay) {
          if (currentCalDate.isSame(currentDbDay.date, 'day')) {
            dbDatesIndex += 1;
            return getCalendarDayFromDbDay(currentDbDay, usersAmount);
          }
        }
        return currentDay;
      })
    );

  res.send(calendar);
}
