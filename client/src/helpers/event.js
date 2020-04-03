import {
  get,
  post
} from "./wrappedRequests";

import Utils from "../utils";

const EventHelper = {};

EventHelper.postNewEvent = async (newEvent) => {
  Utils.expectToExist(newEvent, "new event");
  return post(`/api/newevent`, newEvent);
}

EventHelper.getEvent = async (_id) => {
  Utils.expectToExist(_id, "event _id");
  return get(`/api/event/${_id}`);
}

EventHelper.postAttendance = async (_id, attending) => {
  Utils.expectToExist(_id, "event _id");
  return post(`/api/attend/event/${_id}`, {
    attending
  });
}

EventHelper.deleteEvent = async (_id) => {
  Utils.expectToExist(_id, "event _id");
  return post(`/api/event/delete`, {
    _id
  });
}

EventHelper.updateItems = async (_id, items) => {
  Utils.expectToExist(_id, "event _id");
  Utils.expectToExist(items, "items");
  return post(`/api/event/${_id}/items`, {
    items
  });
}

EventHelper.addOneItemToUser = async (_id, item) => {
  Utils.expectToExist(_id, "event _id");
  Utils.expectToExist(item, "item");
  return post("/api/event/item/add-one", {
    _id,
    item
  });
}

EventHelper.subOneItemToUser = async (_id, item) => {
  Utils.expectToExist(_id, "event _id");
  Utils.expectToExist(item, "item");
  return post("/api/event/item/sub-one", {
    _id,
    item
  });
}

EventHelper.addItem = async (_id, item, amount) => {
  Utils.expectToExist(_id, "event _id");
  Utils.expectToExist(item, "item");
  Utils.expectToExist(amount, "amount");
  return post("/api/event/item/add", {
    _id,
    item,
    amount
  });
}

export default EventHelper;