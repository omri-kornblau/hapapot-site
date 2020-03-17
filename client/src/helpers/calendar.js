import Axios from "axios";

import Utils from "../utils";

const CalendarHelper = {};

CalendarHelper.getCalendarChunk = async chunkNum => {
  Utils.expectToExist(chunkNum, "chunk number");
  return await Axios.get(`/api/calendar/${chunkNum}`);
}

export default CalendarHelper;