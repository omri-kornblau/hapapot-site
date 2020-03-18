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
    _id: `${generateId(eventDate, eventName)}`
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
  const _id = generateId(eventDate, eventName);

  await EventModel.updateOne({
    _id: _id,
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
        amount: 0
      }
    }
  })

  const res = await EventModel.updateOne({
    _id: _id
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

  await EventModel.updateOne({
    _id: _id
  }, {
    $max: {
      "items.$[outer].users.$[inner].amount": 0
    },

  }, {
    "arrayFilters": [{
      "outer.name": item
    }, {
      "inner.name": username
    }]
  })

  var event = await getEventFromDb(eventDate, eventName);

  return event
};

exports.add = async (req, res) => {
  const item = req.body.item
  const amount = req.body.amount
  const eventDate = Utils.dateToDayQuery(req.body.eventDate);
  const eventName = req.body.eventName
  const _id = generateId(eventDate, eventName);

  if (amount < 1) {
    throw Boom.badRequest("Amount mast be bigger then 0");
  }

  const mongo_res = await EventModel.updateOne({
    _id: _id,
    items: {
      $not: {
        $elemMatch: {
          name: item
        }
      }
    }
  }, {
    $push: {
      items: {
        name: item,
        neededamount: amount,
        users: []
      }
    }
  });

  if (mongo_res.ok !== 1 || mongo_res.nModified !== 1) {
    throw Boom.badRequest(`failed to update item: ${item}, ${eventDate}, ${eventName}, ${mongo_res}`)
  }

  var event = await getEventFromDb(eventDate, eventName);

  return sendEvent(res, 200, event);
}

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