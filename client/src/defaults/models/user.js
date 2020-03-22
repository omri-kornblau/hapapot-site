const User = {};

User.data = {
  nicknames: ["", ""],
  username: "",
  password: "",
  birthday: new Date("01/01/1999"),
  single: true,
  carsize: 0,
  picture: "",
  firstname: "",
  lastname: "",
  aboutme: "",
  instagram: {
    username: " ",
    profilePic: null
  },
  phonenumber: 0
};

User.inputAttributes = {
  username: {
    label: "שם משתמש",
    type: "username",
    required: true
  },
  password: {
    label: "סיסמה",
    type: "password",
    required: true
  },
  passwordConfirmation: {
    label: "אישור סיסמה",
    type: "password",
    required: true
  },
  birthday: {
    label: "יום הולדת",
    type: "datepicker",
    required: true
  },
  single: {
    label: "רווק?",
    type: "checkbox",
    required: true
  },
  carsize: {
    label: "גודל מכונית",
    type: "number",
    required: true
  },
  firstname: {
    label: "שם פרטי",
    type: "",
    required: true
  },
  lastname: {
    label: "שם משפחה",
    type: "",
    required: true
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
  },
  phonenumber: {
    label: "טלפון",
    type: "",
    required: true
  },
  instagram: {
    label: "אינסטגרם",
    type: "instagram",
    required: true
  },

};

export default User;