import Axios from "axios";

import Utils from "../utils";

const EventHelper = {};

EventHelper.postNewEvent = async (date, eventName, newEvent) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(eventName, "eventName");
  await Axios.post(`/api/newevent/${date}/${eventName}`, newEvent);
}

EventHelper.getEvent = async (date, eventName) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(eventName, "eventName");
  return Axios.get(`/api/event/${this.date}/${this.name}`);
}

EventHelper.addOneItemToUser = async (item, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return Axios.post("/api/event/item/add-one", {
    item,
    eventDate,
    eventName
  });
}

EventHelper.subOneItemToUser = async (item, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return Axios.post("/api/event/item/sub-one", {
    item,
    eventDate,
    eventName
  });
}

export default EventHelper;