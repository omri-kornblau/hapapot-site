import {
  get,
  post
} from "./wrappedRequests";

import Utils from "../utils";

const DayHelper = {};

DayHelper.getDay = async date => {
  Utils.expectToExist(date, "date");
  return get(`/api/day/${date}`);
}

DayHelper.postAttendance = async (date, attending) => {
  return post(`/api/attend/day/${date}`, {
    attending
  });
}

export default DayHelper;