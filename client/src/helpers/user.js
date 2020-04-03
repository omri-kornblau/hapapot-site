import {
  get,
  post
} from "./wrappedRequests";

const UserHelper = {};

UserHelper.getUser = async () => {
  return get(`/api/user/`);
}

UserHelper.addUser = async userData => {
  return post("/api/newuser", userData);
}

UserHelper.updateUser = async userData => {
  return post(`/api/user/`, userData)
}

export default UserHelper;