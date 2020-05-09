const User = {};

User.data = {
  nicknames: [],
  username: "",
  password: "",
  birthday: new Date("01/01/1999"),
  single: true,
  carsize: 0,
  picture: "",
  firstname: "",
  lastname: "",
  aboutme: "",
  code: ""
};

User.inputAttributes = {
  username: {
    label: "שם משתמש (לפחות 3 אותיות)",
    type: "username",
    require: true
  },
  password: {
    label: "סיסמה (באורך 6 לפחות, לא רוצים שהגלרז יפרצו)",
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
    required: true
  }
};

export default User;