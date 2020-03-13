const moment = require("moment");

exports.dateToDayQuery = date => {
  return moment(date).format("YYYY-MM-DD");
}