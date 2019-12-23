const Mongoose = require("mongoose");
const Express = require("express");

const router = Express.Router();
const UserModel = Mongoose.model("User");

router.get(`/aboutus`, async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

module.exports = router;
