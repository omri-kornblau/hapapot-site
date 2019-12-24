const Mongoose = require('mongoose');
const Express = require('express');
const Boom = require('boom');
const moment = require('moment');

const router = Express.Router()
const DayModel = Mongoose.model('Day');

const weeksToShow = 2;
const daysToShow = weeksToShow * 7;

const getCalendarChunk = async (req, res) => {
  const emptyDay = {
    participants: 0,
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
  relevantDays = await DayModel.find({ date: {
      $gte: dateRangeStart.toISOString(),
      $lt: dateRangeEnd.toISOString()
    }
  }).sort('date');

  let dbDatesIndex = 0;
  const calendar = [];
  for (let idx = 0; idx < daysToShow; idx++) {
    const currentDbDay = relevantDays[dbDatesIndex];
    const currentCalDate = dateRangeStart.clone().add(idx, 'days');
    const currentDay = {...emptyDay};
    currentDay.date = currentCalDate.toISOString();
    if (!!currentDbDay) {
      if (currentCalDate.isSame(currentDbDay.date, 'day')) {
        dbDatesIndex += 1;
        calendar.push(currentDbDay);
        continue;
      }
    }
    calendar.push(currentDay);
  }

  res.send(calendar);
}

router.get(`/:chunk`, getCalendarChunk);

module.exports = router;