const Mongoose = require("mongoose");
const Utils = require("../utils")
const _ = require("lodash");

const DayModel = Mongoose.model("Day");

const emptyDay = {
    users: [],
    events: [],
    date: "",
    rating: 0
}

exports.getAndCreateIfEmpty = async date => {
    const day = await DayModel.findOne({
        date: Utils.dateToDayQuery(date)
    });
    if (!!day) {
        return day;
    }
    const newDay = _.cloneDeep(emptyDay);
    newDay.date = Utils.dateToDayQuery(date);
    return await DayModel.create(newDay);
}