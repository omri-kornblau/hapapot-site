const Mongoose = require('mongoose');
const Boom = require('boom');
const moment = require('moment');

const DayModel = Mongoose.model('Day');
const UserModel = Mongoose.model('User');

const weeksToShow = 2;
const daysToShow = weeksToShow * 7;

const getCalendarDayFromDbDay = (dbDay, usersAmount) => {
  const attendance = 100 * (dbDay.users.length / usersAmount);
  const { date, events } = dbDay;
  return { attendance, date, events };
}

exports.getCalendarChunk = async (req, res) => {
  const emptyDay = {
    attendance: 0,
    events: [],
    date: ""
  }

  const chunk = Number(req.params.chunk);
  if (!Number.isInteger(chunk)) {
    Boom.badRequest('Given chunk is not an integer');
  }
  const startOfWeek = moment().startOf('week');
  const dateRangeStart = startOfWeek.clone()
    .subtract(chunk, 'weeks');
  const dateRangeEnd = startOfWeek.clone()
    .add(7*(weeksToShow - chunk) - 1, 'days');
  const relevantDays = await DayModel.find({ date: {
      $gte: dateRangeStart.toISOString(),
      $lt: dateRangeEnd.toISOString()
    }
  }).sort('date');
  const usersAmount = await UserModel.count();

  let dbDatesIndex = 0;
  const calendar = Object.keys(Array(daysToShow).fill(0)).map(idx => {
    const currentDbDay = relevantDays[dbDatesIndex];
    const currentCalDate = dateRangeStart.clone().add(idx, 'days');
    const currentDay = {...emptyDay};
    currentDay.date = currentCalDate.toISOString();
    if (!!currentDbDay) {
      if (currentCalDate.isSame(currentDbDay.date, 'day')) {
        dbDatesIndex += 1;
        return getCalendarDayFromDbDay(currentDbDay, usersAmount);
      }
    }
    return currentDay;
  });

  res.send(calendar);
}
