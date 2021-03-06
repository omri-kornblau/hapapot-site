const Express = require("express");

const withAuth = require("../middleware").withAuth;
const CalendarRoutes = require("./calendar");
const AuthRoutes = require("./authentication");
const UserRoutes = require("./user");
const DayRoutes = require("./day");
const EventRoutes = require("./event");

const router = Express.Router();

router.post("/api/user", withAuth, UserRoutes.upsertUser)
router.post("/api/newuser", UserRoutes.insertUser)

router.get("/api/user", withAuth, UserRoutes.getUser);
router.get("/api/aboutus", withAuth, UserRoutes.getUsers)

router.get("/api/calendar/:chunk", withAuth, CalendarRoutes.getCalendarChunk)
router.get("/api/day/:date", withAuth, DayRoutes.getDay)
router.post("/api/attend/day/:date", withAuth, DayRoutes.updateDayAttendancy)

router.get("/api/event/:_id", withAuth, EventRoutes.getEvent);
router.post("/api/newevent", withAuth, EventRoutes.insertEvent);
router.post("/api/updateevent/:_id", withAuth, EventRoutes.updateEvent);
router.post("/api/event/item/add-one", withAuth, EventRoutes.addOne);
router.post("/api/event/item/sub-one", withAuth, EventRoutes.subOne);
router.post("/api/event/item/add", withAuth, EventRoutes.addItem);
router.post("/api/event/:_id/items", withAuth, EventRoutes.updateItems);
router.post("/api/event/:_id/cars/add", withAuth, EventRoutes.addCar);
router.post("/api/event/:_id/cars/movePassenger", withAuth, EventRoutes.movePassenger);
router.post("/api/event/:_id/cars/update", withAuth, EventRoutes.updateCars);
router.post("/api/attend/event/:_id", withAuth, EventRoutes.updateEventAttendance);
router.post("/api/event/delete", withAuth, EventRoutes.deleteEvent);

router.post("/auth/authenticate", AuthRoutes.register);
router.get("/auth/checktoken", withAuth, AuthRoutes.checkToken);
router.get("/auth/logout", withAuth, AuthRoutes.logout)

module.exports = router;