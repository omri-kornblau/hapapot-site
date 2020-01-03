const Express = require("express");

const withAuth = require("../middleware").withAuth;
const CalendarRoutes = require("./calendar");
const AuthRoutes = require("./authentication");
const UserRoutes = require("./user");
const DayRoutes = require("./day");
const EventRoutes = require("./event");

const router = Express.Router();

router.post('/api/user', UserRoutes.upsertUser)
router.post('/auth/authenticate', AuthRoutes.register)

router.get('/api/user', withAuth, UserRoutes.getUser);
router.get('/api/aboutus', withAuth, UserRoutes.getUsers)

router.get('/api/calendar/:chunk', withAuth, CalendarRoutes.getCalendarChunk)
router.get('/api/day/:date', withAuth, DayRoutes.getDay)
router.get('/api/attend/day/:date', withAuth, DayRoutes.attendDay)
router.get('/api/absent/day/:date', withAuth, DayRoutes.absentDay)

router.get("/api/event/:name/day/:date", EventRoutes.getEvent);
router.get("/api/event/item/add-one", EventRoutes.addOne, withAuth);
router.get("/api/event/item/sub-one", EventRoutes.subOne, withAuth);

router.post("/auth/authenticate", AuthRoutes.register);
router.get("/auth/checktoken", withAuth, AuthRoutes.checkToken);

module.exports = router;
