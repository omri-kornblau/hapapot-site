import Axios from "axios"

const Auther = {};

Auther.authenticate = async (userData, stayLogged) => {
  await Axios.post(`/auth/authenticate?stay=${stayLogged}`, userData);
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
  return await Axios.get("/auth/logout");
}

export default Auther;