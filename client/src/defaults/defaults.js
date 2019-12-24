const Defaults = {};

Defaults.UserData = {
  nicknames: [],
  username: "",
  password: "",
  birthday: new Date(),
  single: true,
  cartype: 0,
  picture: "",
  firstname: "",
  lastname: "",
  aboutme: ""
};

Defaults.Day = {
  date: new Date(),
  events: [],
  users: [],
  rating: 0
};

Defaults.event = {
  name: "מסיבה",
  eventkey: "shalom",
  icon: "icon-bag-16",
  cars: { ido: ["omrik"] },
  items: {},
  time: new Date(),
  moneylink: ""
};

module.exports = Defaults;
