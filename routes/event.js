const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");
const Utils = require("../utils")
const MongoHelpers = require("../models/mongoHelpers")

const EventModel = Mongoose.model("Event");
const UserModel = Mongoose.model("User");
const DayModel = Mongoose.model("Day");

exports.getEvent = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    username
  } = req;

  const event = await getEventFromDb(_id, username);

  if (event) {
    return res.send({
      event,
      username
    });
  } else {
    throw Boom.notFound(`Event does not exist: ${_id}`);
  }
};

const sendEvent = (res, status, event) => {
  res.status(status).send(event);
};

const getEventFromDb = async (_id, username) => {
  if (!username) {
    throw Boom.internal("No username was given");
  }
  const event = await EventModel.findOne({
    _id
  });
  if (!event) {
    throw Boom.notFound(`Event does not exist: ${_id}`);
  }

  event.attending = _.includes(event.users, username);
  event.users = await UserModel.find({
    username: {
      $in: event.users
    }
  });

  return event;
}

const addAmount = async (_id, item, amount, username) => {
  await EventModel.updateOne({
    _id,
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
    _id
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
    throw Boom.badRequest(`failed to update item: ${item}, in event ${_id}`);
  }

  await EventModel.updateOne({
    _id
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

  return getEventFromDb(_id, username);
};

exports.addItem = async (req, res) => {
  const {
    item,
    amount,
    _id,
  } = req.body;
  const {
    username
  } = req;

  if (amount < 1) {
    throw Boom.badRequest("Amount must be bigger then 0");
  }

  const mongo_res = await EventModel.updateOne({
    _id,
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
    throw Boom.badRequest(`failed to update item: ${item} in event ${_id}`);
  }

  const event = await getEventFromDb(_id, username);

  return sendEvent(res, 200, event);
}

exports.addOne = async (req, res) => {
  const {
    item,
    _id
  } = req.body;
  const updateEvent = await addAmount(
    _id,
    item,
    1,
    req.username
  );
  return sendEvent(res, 200, updateEvent);
};

exports.subOne = async (req, res) => {
  const {
    _id,
    item
  } = req.body;
  const updateEvent = await addAmount(
    _id,
    item,
    -1,
    req.username
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

exports.updateEvent = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    name,
    time,
    description
  } = req.body;
  const {
    username
  } = req;

  // remove event from old day
  const oldEvent = await getEventFromDb(_id, username);
  const oldDate = Utils.dateToDayQuery(oldEvent.time);
  await DayModel.updateOne({
    date: oldDate
  }, {
    $pull: {
      events: _id
    }
  });

  // add event to new day
  const date = Utils.dateToDayQuery(time);
  await MongoHelpers.getAndCreateIfEmpty(date);
  await DayModel.updateOne({
    date
  }, {
    $addToSet: {
      events: _id
    }
  });

  // update event data
  await EventModel.updateOne({
    _id,
  }, {
    $set: {
      name,
      time,
      description
    }
  });

  const event = await getEventFromDb(_id, username);
  return sendEvent(res, 200, event);
}

exports.updateItems = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    items
  } = req.body;
  const {
    username
  } = req;
  const updateRes = await EventModel.updateOne({
    _id
  }, {
    $set: {
      items
    }
  });

  const event = await getEventFromDb(_id, username);

  return sendEvent(res, 200, event);
}

exports.updateEventAttendance = async (req, res) => {
  const {
    _id
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

  await EventModel.update({
    _id
  }, dbOperation);

  if (!attending) {
    await EventModel.update({
      _id
    }, {
      $pull: {
        "items.$[].users": {
          name: username
        }
      }
    });
  }

  const event = await getEventFromDb(_id, username);

  sendEvent(res, 200, event);
}

exports.deleteEvent = async (req, res) => {
  const {
    _id
  } = req.body;

  await EventModel.remove({
    _id
  });

  res.status(200).send();
}