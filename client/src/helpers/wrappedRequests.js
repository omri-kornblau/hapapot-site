import Axios from "axios";

const get = async (...args) => {
  try {
    const res = await Axios.get(...args);
    return res;
  } catch (err) {
    if (err.response.status === 401) {
      window.location.replace(`/login?origin=${window.location.pathname}`);
      return;
    }
    throw err;
  }
}

const post = async (...args) => {
  try {
    const res = await Axios.post(...args);
    return res;
  } catch (err) {
    if (err.response.status === 401) {
      window.location.replace(`/login?origin=${window.location.pathname}`);
      return;
    }
    throw err;
  }
}

export {
  get,
  post
};