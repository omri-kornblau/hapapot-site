import {
  get,
  post
} from "./wrappedRequests";

import Utils from "../utils";

const EventHelper = {};

EventHelper.postNewEvent = async (date, name, newEvent) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "eventName");
  await post(`/api/newevent/${date}/${name}`, newEvent);
}

EventHelper.getEvent = async (date, name) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "name");
  return get(`/api/event/${date}/${name}`);
}

EventHelper.postAttendance = async (date, name, attending) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "name");
  return post(`/api/attend/event/${date}/${name}`, {
    attending
  });
}

EventHelper.deleteEvent = async (date, name) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "name");
  return post(`/api/event/delete`, {
    date,
    name
  });
}

EventHelper.updateItems = async (date, name, items) => {
  Utils.expectToExist(items, "items");
  Utils.expectToExist(date, "event date");
  Utils.expectToExist(name, "event name");
  return post(`/api/event/${date}/${name}/items`, {
    items
  });
}

EventHelper.addOneItemToUser = async (item, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return post("/api/event/item/add-one", {
    item,
    eventDate,
    eventName
  });
}

EventHelper.subOneItemToUser = async (item, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return post("/api/event/item/sub-one", {
    item,
    eventDate,
    eventName
  });
}

EventHelper.addItem = async (item, amount, eventDate, eventName) => {
  Utils.expectToExist(item, "item");
  Utils.expectToExist(eventDate, "eventDate");
  Utils.expectToExist(eventName, "eventName");
  return post("/api/event/item/add", {
    item,
    amount,
    eventDate,
    eventName
  });
}

export default EventHelper;