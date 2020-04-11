const _ = require("lodash");
const Mongoose = require("mongoose");
const Boom = require("boom");
const Utils = require("../utils")
const MongoHelpers = require("../models/mongoHelpers")
const Mongodb = require("mongodb")

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

  const attending = _.includes(event.users, username);

  event.users = await UserModel.find({
    username: {
      $in: event.users
    }
  });

  return {
    attending,
    ...event.toJSON()
  };
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

  return res.status(204).send();
}

exports.addOne = async (req, res) => {
  const {
    item,
    _id
  } = req.body;
  await addAmount(
    _id,
    item,
    1,
    req.username
  );
  return res.status(204).send();
};

exports.subOne = async (req, res) => {
  const {
    _id,
    item
  } = req.body;
  await addAmount(
    _id,
    item,
    -1,
    req.username
  );
  return res.status(204).send();
};

exports.insertEvent = async (req, res) => {
  const newEvent = req.body;
  try {
    const newEventFromDb = await EventModel.create(newEvent);
    return res.status(201).send(newEventFromDb);
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
    location,
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
      location,
      description
    }
  });

  return res.status(204).send();
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

  return res.status(204).send();
}

exports.addCar = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    maxPassengers
  } = req.body;

  await EventModel.updateOne({
    _id
  }, {
    $push: {
      cars: {
        driver: "",
        passengers: [],
        _id: Mongodb.ObjectID().toString(),
        maxPassengers,
      }
    }
  })

  return res.status(204).send();
}

exports.movePassenger = async (req, res) => {
  const {
    username
  } = req;
  const {
    _id
  } = req.params;
  const {
    passenger,
    destCarId,
    isDriver
  } = req.body;

  // Remove passenger from old car
  // Maybe it will be better to recieve also the source car
  // from the client, insted of loop over all the cars
  await EventModel.updateOne({
    _id
  }, {
    $pull: {
      "cars.$[].passengers": passenger
    },
    $set: {
      "cars.$[car].driver": ""
    }
  }, {
    "arrayFilters": [{
      "car.driver": passenger
    }]
  });

  if (isDriver) {
    // Set the passenger as driver
    await EventModel.updateOne({
      _id,
      cars: {
        $elemMatch: {
          _id: destCarId
        }
      }
    }, {
      $set: {
        "cars.$.driver": passenger
      }
    });
  } else {
    // Get car MaxPassengers
    var event = await getEventFromDb(_id, username);
    var maxPassengers = 0;
    event.cars.forEach(car => {
      if (car._id === destCarId) {
        maxPassengers = car.maxPassengers
      }
    });

    // Add passenger to the car
    await EventModel.updateOne({
      _id,
      cars: {
        $elemMatch: {
          _id: destCarId,
          passengers: {
            $not: {
              $in: [passenger]
            }
          }
        },
      }
    }, {
      $push: {
        "cars.$.passengers": {
          $each: [passenger],
          $slice: maxPassengers
        }
      }
    });
  }

  return res.status(204).send();
}

exports.updateCars = async (req, res) => {
  const {
    _id
  } = req.params;
  const {
    actions
  } = req.body;

  await Promise.all(Object.keys(actions).map(async carId => {
    var operation = {};
    car = actions[carId];
    const DELETE = "delete";
    const EDIT_MAX_PASSENGERS = "editMaxPassengers";
    switch (car.type) {
      case EDIT_MAX_PASSENGERS:
        if (car.value > 0) {
          operation = {
            $set: {
              "cars.$.maxPassengers": car.value
            }
          };
        } else {
          return;
        }
        break;
      case DELETE:
        operation = {
          $pull: {
            cars: {
              _id: carId
            }
          }
        }
        break;
      default:
        return
    }

    await EventModel.updateOne({
      _id,
      cars: {
        $elemMatch: {
          _id: carId
        }
      }
    }, operation);
  }))

  return res.status(204).send();
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

  return res.status(204).send();
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