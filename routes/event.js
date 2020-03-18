const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");
const Utils = require("../utils")

const EventModel = Mongoose.model("Event");
const UserModel = Mongoose.model("User");

exports.getEvent = async (req, res) => {
  const {
    name,
    date
  } = req.params;

  const event = await getEventFromDb(date, name);

  return res.send(event);
};

const sendEvent = (res, status, event) => {
  res.status(status).send({
    error: false,
    event: event
  });
};

const generateId = (date, name) => {
  date = Utils.dateToDayQuery(date);
  return `${date}_${name}`;
}

const getEventFromDb = async (eventDate, eventName) => {
  const event = await EventModel.findOne({
    eventId: `${generateId(eventDate, eventName)}`
  });

  if (!event) {
    throw Boom.badRequest(`Event does not exist: ${date}, ${name}`);
  }

  event.users = await UserModel.find({
    username: {
      $in: event.users
    }
  });

  return event;
}

const addAmount = async (item, eventDate, eventName, username, amount) => {
  const eventId = generateId(eventDate, eventName);

  await EventModel.updateOne({
    eventId: eventId,
    items: {
      $elemMatch: {
        name: item,
        users: {
          $not: {
            $elemMatch: {
              name: username
            }
          },
        }
      }
    }
  }, {
    $push: {
      "items.$.users": {
        name: username,
        "amount": 0
      }
    }
  })

  const res = await EventModel.updateOne({
    eventId: eventId
  }, {
    $inc: {
      "items.$[outer].users.$[inner].amount": amount
    },

  }, {
    "arrayFilters": [{
      "outer.name": item
    }, {
      "inner.name": username
    }]
  })

  if (res.ok !== 1 || res.nModified !== 1) {
    throw Boom.badRequest(`failed to update item: ${item}, ${eventDate}, ${eventName}, ${username}, ${amount}, ${res}`)
  }

  return getEventFromDb(eventDate, eventName);
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

exports.insertEvent = async (req, res) => {
  const newEvent = req.body;
  try {
    const newEventFromDb = await EventModel.create(newEvent);
    return sendEvent(res, 201, newEventFromDb);
  } catch (err) {
    if (err.code === 11000) {
      throw Boom.badRequest("Event with this name already exists in this day", {
        appCode: 1010
      });
    }
    throw err;
  }
}