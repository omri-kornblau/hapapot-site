const Express = require("express");

const withAuth = require('../middleware').withAuth;
const CalendarRoutes = require('./calendar');
const AuthRoutes = require('./authentication');
const UserRoutes = require('./user');
const DayRoutes = require('./day');

const router = Express.Router();

router.get('/api/user', withAuth, UserRoutes.getUser);
router.post('/api/user', withAuth, UserRoutes.upsertUser)
router.get('/api/aboutus', withAuth, UserRoutes.getUsers)

router.get('/api/calendar/:chunk', CalendarRoutes.getCalendarChunk)
router.get('/api/day/:date', DayRoutes.getDay)
router.get('/api/attend/day/:date', withAuth, DayRoutes.attendDay)
router.get('/api/absent/day/:date', withAuth, DayRoutes.absentDay)

router.post('/auth/authenticate', AuthRoutes.register)
router.get('/auth/checktoken', withAuth, AuthRoutes.checkToken)

module.exports = router;