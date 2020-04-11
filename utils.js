const _ = require("lodash");
const moment = require("moment");

exports.dateToDayQuery = date => {
  return moment(date).format("YYYY-MM-DD");
}

exports.getRandomPassword = length => {
  return Math.random().toString(36).slice(-1 * length);
}

exports.getBroughtAmount = item => {
  return _.reduce(item.users, (sum, user) => sum + user.amount, 0);
}