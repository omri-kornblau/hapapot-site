import Axios from "axios";

import Utils from "../utils";
import {
  Util
} from "reactstrap";

const EventHelper = {};

EventHelper.postNewEvent = async (date, eventName, newEvent) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(eventName, "eventName");
  await Axios.post(`/api/newevent/${date}/${eventName}`, newEvent);
}

EventHelper.getEvent = async (date, name) => {
  Utils.expectToExist(date, "date");
  Utils.expectToExist(name, "name");
  return Axios.get(`/api/event/${date}/${name}`);
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
  Utils.expectToExist(item);
  Utils.expectToExist(amount);
  Utils.expectToExist(eventDate);
  Utils.expectToExist(eventName);
  return Axios.post("/api/event/item/add", {
    item,
    amount,
    eventDate,
    eventName
  });
}

export default EventHelper;