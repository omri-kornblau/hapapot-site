import Axios from "axios";

import Utils from "../utils";

const EventHelper = {};

EventHelper.postNewEvent = async (date, eventName, newEvent) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(eventName, "eventName");
  await Axios.post(`/api/event/${date}/${eventName}`, newEvent);
}

export default EventHelper;