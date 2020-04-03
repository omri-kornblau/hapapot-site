const Event = {};

Event.data = {
  name: "",
  description: " ", // Space here is important otherwise joi will call this 'empty'
  icon: "icon-bag-16",
  cars: [],
  items: [],
  users: [],
  time: new Date(),
  moneylink: ""
};

export default Event;