import Axios from "axios"

const Auther = {};

Auther.authenticate = async userData => {
  await Axios.post("/auth/authenticate", userData);
}

Auther.checkToken = async () => {
  try {
    await Axios.get("/auth/checktoken");
    return true;
  } catch (err) {
    return false;
  }
}

Auther.logout = async () => {
  await Axios.get("/auth/logout");
}

export default Auther;