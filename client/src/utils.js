const moment = require("moment");

const Utils = {};

Utils.formatDate = isoDate => {
  const dateTime = moment(isoDate);
  return dateTime.format("DD/MM/YYYY");
};

module.exports = Utils;
