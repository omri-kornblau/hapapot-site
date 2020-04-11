const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const promisify = require("util").promisify;

const hashCompare = promisify(Bcrypt.compare);
const hash = promisify(Bcrypt.hash);

const Utils = require("../utils");

const saltRounds = 10;

const mongoFormat = {
  username: {
    type: String
  },
  tokenPassword: {
    type: String,
  },
  salt: {
    type: String
  }
}

const cookieSchema = new Mongoose.Schema(mongoFormat);

cookieSchema.pre("save", async function () {
  this.salt = Utils.getRandomPassword(16);
  this.tokenPassword = await hash(this.tokenPassword + this.salt, saltRounds);
});

cookieSchema.methods.isCorrectCookie = async function (tokenPassword) {
  return hashCompare(tokenPassword + this.salt, this.tokenPassword);
}

const Cookie = Mongoose.model("Cookie", cookieSchema);

module.exports = Cookie;