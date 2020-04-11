const Utils = {};

Utils.getUserCar = (user, cars) => {
  var carId = "";
  cars.forEach(car => {
    if (car.passengers.includes(user) || car.driver === user) {
      carId = car._id;
    }
  });

  return carId
}

Utils.getPassengerswithoutCar = (users, cars) => {
  return users.filter(user => (
    Utils.getUserCar(user.username, cars) === ""
  ));
}

export default Utils;