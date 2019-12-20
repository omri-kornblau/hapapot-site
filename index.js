const Express = require('express');
const Boom = require('express-boom');
const Mongoose = require('mongoose');
const BodyParser = require('body-parser');
const Logger = require('morgan');
const Path = require('path')

// Import configurations
const DbConfig = require('./config/database')
const ServerConfig = require('./config/server')

// Import models
require('./models/user');

const serverPort = ServerConfig.port || 8080
const mongoDbUrl = DbConfig.url || "mongodb://localhost:27017"

// Connect to mongo db
Mongoose.connect(mongoDbUrl, { useNewUrlParser: true });
const db = Mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Setup the server
const app = Express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(Logger('dev'));
app.use(Boom())
app.use(Express.static(Path.join(__dirname, '../client/build')));
app.use('/api', require('./routes/users'));

if (ServerConfig.enviornment === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
      res.sendFile(Path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

app.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
});