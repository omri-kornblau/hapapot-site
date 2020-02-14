const Defaults = {};

Defaults.UserData = {
  nicknames: [],
  username: "",
  password: "",
  birthday: new Date("01/01/1999"),
  single: true,
  carsize: 0,
  picture: "",
  firstname: "",
  lastname: "",
  aboutme: ""
};

Defaults.UserDataAttributes = {
  username: {
    label: "שם משתמש",
    type: "username",
    require: true
  },
  password: {
    label: "סיסמה",
    type: "password",
    require: true
  },
  passwordConfirmation: {
    label: "אישור סיסמה",
    type: "password",
    require: true
  },
  birthday: {
    label: "יום הולדת",
    type: "datepicker",
    require: true
  },
  single: {
    label: "רווק?",
    type: "checkbox",
    require: true
  },
  carsize: {
    label: "גודל מכונית",
    type: "number",
    require: true
  },
  firstname: {
    label: "שם פרטי",
    type: "",
    require: true
  },
  lastname: {
    label: "שם משפחה",
    type: "",
    require: true
  },
  nicknames: {
    label: " שמות חיבה מופרדים בפסיק",
    type: "",
    required: true
  },
  aboutme: {
    label: "קצת עלייך",
    type: "",
    require: false
  },
  picture: {
    label: "תמונה",
    type: "file",
    require: true
  }
};

Defaults.Day = {
  date: "",
  events: [],
  users: [],
  rating: 0
};

Defaults.event = {
  name: "מסיבה",
  eventkey: "shalom",
  icon: "icon-bag-16",
  cars: {
    ido: ["omrik"]
  },
  items: {},
  time: new Date(),
  moneylink: ""
};

module.exports = Defaults;