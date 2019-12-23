const Express = require('express');
const Mongoose = require('mongoose');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Logger = require('morgan');
const Path = require('path')

const AsyncErrorsHandler = require('./errors/express-async-errors');
const ErrorsRouter = require('./errors/errors-router');
const withAuth = require('./middleware').withAuth;

// Import configurations
const DbConfig = require('./config/database')
const ServerConfig = require('./config/server')

// Import models
require('./models/user');
require('./models/day');

AsyncErrorsHandler.patchRouter(ErrorsRouter.route);

// Connect to mongo db
Mongoose.connect(DbConfig.url, { useNewUrlParser: true });
const db = Mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Setup the server
const app = Express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Logger('dev'));
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, '../client/build')));
app.use('/api/user', withAuth, require('./routes/users'));
app.use('/api/calendar', withAuth, require('./routes/calendar'));
app.use('/auth', require('./routes/authentication'));

if (ServerConfig.production) {
  app.use(Express.static('client/build'));
  app.get('*', (req, res) => {
      res.sendFile(Path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

app.listen(ServerConfig.port, () => {
  console.log(`Server running on port ${ServerConfig.port}`);
});