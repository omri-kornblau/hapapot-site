const Mongoose = require("mongoose");
const moment = require("moment");

const UserModel = Mongoose.model("User");
const DayModel = Mongoose.model("Day");

exports.getDay = async (req, res) => {
  const emptyDay = {
    users: [],
    events: [],
    date: ""
  }

  const { date } = req.params;
  const day = await DayModel.findOne({
    date: { $regex: RegExp(`^${date}`, "i") }
  });
  if (!day) {
    emptyDay.date = moment(date).toISOString();
    return res.send(emptyDay);
  }
  const usersData = await Promise.all(
    day.users.map(async user => {
      const userFromDb = await UserModel.findOne({ username: user });
      return userFromDb.nicknames[0];
    })
  );
  day.users = usersData;
  return res.send(day);
}
