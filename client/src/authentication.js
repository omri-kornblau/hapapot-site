import Axios from 'axios'

const Auther = {};

Auther.authenticate = async userData => {
  try {
    await Axios.post('/api/authenticate', userData);
    return true;
  } catch (err) {
    return false;
  }
}

Auther.checkToken = async () => {
  try {
    await Axios.get('/api/checktoken');
    return true;
  } catch (err) {
    return false;
  }
}

export default Auther;