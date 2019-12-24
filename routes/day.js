const Mongoose = require("mongoose");
const Express = require("express");

const router = Express.Router();
const UserModel = Mongoose.model("User");
const DayModel = Mongoose.model("Day");

router.get(`/day/:date`, async (req, res) => {
  const { date } = req.params;
  const day = await DayModel.findOne({
    date: { $regex: RegExp(`^${date}`, "i") }
  });
  const usersData = await Promise.all(
    day.users.map(async user => {
      const userFromDb = await UserModel.findOne({ username: user });
      return userFromDb.nicknames[0];
    })
  );
  day.users = usersData;
  return res.send(day);
});
module.exports = router;
