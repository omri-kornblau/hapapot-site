import _ from "lodash";

const CarUtils = {};

CarUtils.getUserCar = (user, cars) => {
  return _.find(cars, car => (
    car.passengers.includes(user) || car.driver == user
  ));
}

CarUtils.getPassengerswithoutCar = (users, cars) => {
  return users.filter(user => (
    CarUtils.getUserCar(user.username, cars) === undefined
  ));
}

CarUtils.editMaxPassengers = (state, action) => {
  const cars = state.cars.map(car => {
    if (car._id === action._id) {
      car.maxPassengers = action.value;
    }
    return car;
  });

  const actions = _.clone(state.actions);
  actions[action._id] = action;

  return {
    ...state,
    actions,
    cars
  };
}

CarUtils.deleteCar = (state, action) => {
  const cars = state.cars.filter(car => (
    car._id !== action._id
  ));

  const actions = _.clone(state.actions);
  actions[action._id] = {
    type: action.type
  };

  return {
    ...state,
    actions,
    cars
  };
}

CarUtils.getCarUser = (users, driverUserName) => {
  return _.find(users, { username: driverUserName });
}

export default CarUtils;