const mongoose = require('mongoose');

const config = require('./Config');
const Server = require('./Server');
const UsersController = require('./users/users.controller');

const mongoUri = `mongodb://${config.mongo.host}:${config.mongo.port}/test`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  keepAlive: 1,
});
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to mongodb: ${mongoUri}`);
});

const server = new Server([new UsersController()], config.port);
server.start();

export = server.app;
