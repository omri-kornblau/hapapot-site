import {
  get
} from "./wrappedRequests";

import Utils from "../utils";

const CalendarHelper = {};

CalendarHelper.getCalendarChunk = async chunkNum => {
  Utils.expectToExist(chunkNum, "chunk number");
  return get(`/api/calendar/${chunkNum}`);
}

export default CalendarHelper;