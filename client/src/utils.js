const moment = require("moment");

const Utils = {};

Utils.formatDate = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("DD/MM/YYYY");
};

Utils.formatTime = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("HH:mm");
};

Utils.toRange = (num, rangeStart, rangeEnd, numRange=100) => {
  return (num * (rangeEnd - rangeStart) / numRange) + rangeStart;
}

module.exports = Utils;
