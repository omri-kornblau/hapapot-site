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
  const {
    username
  } = req;

  const event = await getEventFromDb(date, name, username);

  return res.send(event);
};

const sendEvent = (res, status, event) => {
  res.status(status).send(event);
};

const generateId = (date, name) => {
  date = Utils.dateToDayQuery(date);
  return `${date}_${name}`;
}

const getEventFromDb = async (eventDate, eventName, username) => {
  if (!username) {
    throw Boom.internal("No username was given");
  }
  const event = await EventModel.findOne({
    eventId: `${generateId(eventDate, eventName)}`
  });
  if (!event) {
    throw Boom.notFound(`Event does not exist: ${eventDate}, ${eventName}`);
  }

  event.attending = _.includes(event.users, username);
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
        amount: 0
      }
    }
  });

  const res = await EventModel.updateOne({
    eventId: eventId
  }, {
    $inc: {
      "items.$[outer].users.$[inner].amount": amount
    },
    $addToSet: {
      users: username
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
    eventId: eventId
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

  return getEventFromDb(eventDate, eventName, username);
};

exports.addItem = async (req, res) => {
  const {
    item,
    amount,
    eventName
  } = req.body;
  const {
    username
  } = req;
  const eventDate = Utils.dateToDayQuery(req.body.eventDate);

  if (amount < 1) {
    throw Boom.badRequest("Amount must be bigger then 0");
  }

  const mongo_res = await EventModel.updateOne({
    eventId: generateId(eventDate, eventName),
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

  const event = await getEventFromDb(eventDate, eventName, username);

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

exports.updateItems = async (req, res) => {
  const {
    date,
    name
  } = req.params;
  const {
    items
  } = req.body;
  const {
    username
  } = req;
  const updateRes = await EventModel.updateOne({
    eventId: generateId(date, name)
  }, {
    $set: {
      items
    }
  });

  const event = await getEventFromDb(date, name, username);

  return sendEvent(res, 200, event);
}

exports.updateEventAttendance = async (req, res) => {
  const {
    date,
    name
  } = req.params;
  const {
    attending
  } = req.body;
  const {
    username
  } = req;

  const dbOperation = attending ? {
    $addToSet: {
      users: username
    }
  } : {
    $pull: {
      users: username
    }
  };

  const eventId = generateId(date, name)

  await EventModel.update({
    eventId: eventId
  }, dbOperation);

  if (!attending) {
    await EventModel.update({
      eventId: eventId
    }, {
      $pull: {
        "items.$[].users": {
          name: username
        }
      }
    });
  }

  const event = await getEventFromDb(date, name, username);

  sendEvent(res, 200, event);
}

exports.deleteEvent = async (req, res) => {
  const {
    date,
    name
  } = req.body;

  const eventId = generateId(date, name)

  await EventModel.remove({
    eventId: eventId
  });

  res.status(200).send();
}