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
router.post("/auth/authenticate", AuthRoutes.register)

router.get("/api/user", withAuth, UserRoutes.getUser);
router.get("/api/aboutus", withAuth, UserRoutes.getUsers)

router.get("/api/calendar/:chunk", withAuth, CalendarRoutes.getCalendarChunk)
router.get("/api/day/:date", withAuth, DayRoutes.getDay)
router.post("/api/attend/day/:date", withAuth, DayRoutes.updateDayAttendancy)

router.get("/api/event/:date/:name", withAuth, EventRoutes.getEvent);
router.post("/api/newevent/:date/:name", withAuth, EventRoutes.insertEvent);
router.post("/api/event/item/add-one", withAuth, EventRoutes.addOne);
router.post("/api/event/item/sub-one", withAuth, EventRoutes.subOne);
router.post("/api/event/item/add", withAuth, EventRoutes.addItem);
router.post("/api/attend/event/:date/:name", withAuth, EventRoutes.updateEventAttendance);

router.post("/auth/authenticate", AuthRoutes.register);
router.get("/auth/checktoken", withAuth, AuthRoutes.checkToken);

module.exports = router;