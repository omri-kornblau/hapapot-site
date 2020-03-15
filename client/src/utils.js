const moment = require("moment");
const _ = require("lodash");

const Utils = {};

Utils.formatDate = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("DD/MM/YYYY");
};

Utils.formatTime = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("HH:mm");
};

Utils.formatUsersNicknames = nickNames => {
  if (!!nickNames) {
    return nickNames.map(_.sample).join(", ");
  }
}

Utils.toRange = (num, rangeStart, rangeEnd, numRange = 100) => {
  return (num * (rangeEnd - rangeStart) / numRange) + rangeStart;
}

Utils.deepFind = (array, object, testFn) => {
  let foundObject = array[0];
  const findHelper = (array, object) => (
    array.some(elem => {
      if (Array.isArray(elem)) {
        return findHelper(elem, object);
      } else if (testFn(elem, object)) {
        foundObject = elem;
        return true;
      }
      return false;
    })
  );

  findHelper(array, object);
  return foundObject;
}

module.exports = Utils;