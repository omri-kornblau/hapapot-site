const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");

const Utils = require("../utils");

const DayModel = Mongoose.model("Day");

exports.getEvent = async (req, res) => {
  const {
    name,
    date
  } = req.params;
  const day = await DayModel.findOne({
    date
  });
  if (!day) {
    throw Boom.badRequest(`Day not found: ${date}`);
  }

  let current_event = false;
  day.events.forEach(element => {
    if (element.name === name) {
      current_event = element;
    }
  });

  if (!current_event) {
    throw Boom.badRequest(`Event does not exist: ${date}, ${name}`);
  }

  return res.send(current_event);
};

const sendEvent = (res, status, event) => {
  res.status(status).send({
    error: false,
    event: event
  });
};


const getEventFromDb = async (eventDate, eventName) => {
  const eventFromDb = await DayModel.findOne({
    date: eventDate,
    events: {
      $elemMatch: {
        name: eventName
      }
    }
  });

  if (!eventFromDb) {
    throw Boom.badRequest(`Event not found: ${eventDate} , ${eventName}`);
  }

  return eventFromDb["events"][0];
}

const updateEventOnDb = async (eventDate, eventName, newEvent) => {
  await DayModel.updateOne({
    date: eventDate,
    events: {
      $elemMatch: {
        name: eventName
      }
    }
  }, {
    $set: {
      events: 1
    }
  });
}

const addAmount = async (item, eventDate, eventName, username, amount) => {
  var event = await getEventFromDb(eventDate, eventName);

  event.items[item].users[username] += amount

  await updateEventOnDb(eventDate, eventName, event);

  var event = await getEventFromDb(eventDate, eventName);

  return event
};

exports.addOne = async (req, res) => {
  const item = req.body.item
  const eventDate = req.body.eventDate
  const eventName = req.body.eventName
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
  const item = req.body.item
  const eventDate = req.body.eventDate
  const eventName = req.body.eventName
  const updateEvent = await addAmount(
    item,
    eventDate,
    eventName,
    req.username,
    -1
  );
  return sendEvent(res, 200, updateEvent);
};