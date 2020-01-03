const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");

const Utils = require("../utils");

const DayModel = Mongoose.model("Day");

exports.getEvent = async (req, res) => {
  const { name, date } = req.params;
  const day = await DayModel.findOne({ date });
  if (!day) {
    throw Boom.badRequest("Day not found");
  }

  let current_event = false;
  day.events.forEach(element => {
    if (element.name === name) {
      current_event = element;
    }
  });

  if (!current_event) {
    throw Boom.badRequest("Event does not exist");
  }

  return res.send(current_event);
};

const sendEvent = (res, status, event) => {
  res.status(status).send({
    error: false,
    event: event
  });
};

const addAmount = async (item, eventDate, eventName, username, amount) => {
  const day = await DayModel.findOne({
    date: eventDate
  });

  if (!day) {
    throw Boom.badRequest("Day not found");
  }

  const eventFromDb = _.find(day.events, "name", eventName);
  if (!eventFromDb) {
    throw Boom.badRequest("Event not found");
  }

  eventFromDb.items[item].users[username] =
    _.get(eventFromDb.items[item].users, username, 0) + amount;

  return DayModel.updateOne({ date: eventDate }, day);
};

exports.addOne = async (req, res) => {
  const { item, eventDate, eventName } = req.query;
  const updateEvent = await addAmount(
    item,
    eventDate,
    eventName,
    req.username,
    1
  );
  return sendEvent(res, 200, updateEvent);
};

exports.subOne = async (req, res) => {
  const { item, eventDate, eventName } = req.query;
  const updateEvent = await addAmount(
    item,
    eventDate,
    eventName,
    req.username,
    -1
  );
  return sendEvent(res, 200, updateEvent);
};
