import Axios from "axios";

import Utils from "../utils";

const DayHelper = {};

DayHelper.getDay = async date => {
  Utils.expectToExist(date, "date");
  return await Axios.get(`/api/day/${date}`);
}

DayHelper.postAttendance = async (date, attending) => {
  return Axios.post(`/api/attend/day/${date}`, {
    attending
  });
}

export default DayHelper;