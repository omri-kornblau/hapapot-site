import Axios from "axios";

import Utils from "../utils";

const EventHelper = {};

EventHelper.postNewEvent = async (date, name, newEvent) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "eventName");
  await Axios.post(`/api/newevent/${date}/${name}`, newEvent);
}

EventHelper.getEvent = async (date, name) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "name");
  return Axios.get(`/api/event/${date}/${name}`);
}

EventHelper.postAttendance = async (date, name, attending) => {
  return Axios.post(`/api/attend/event/${date}/${name}`, {
    attending
  });
}

EventHelper.deleteEvent = async (date, name) => {
  return Axios.post(`/api/event/delete`, {
    date,
    name
  });
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

EventHelper.addItem = async (item, amount, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(amount, "amount");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return Axios.post("/api/event/item/add", {
    item,
    amount,
    eventDate,
    eventName
  });
}

export default EventHelper;