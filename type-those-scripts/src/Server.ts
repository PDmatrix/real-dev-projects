const bodyParser = require('body-parser');
const express = require('express');
import config from "@app/Config";

const httpStatus = {}

class Server {
  private app;
  private port;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initialize();
    this.initializeControllers(controllers);
  }

  initialize() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((err, req, res, next) =>
      res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {},
      }),
    );
  }

  initializeControllers(controllers) {
    const router = express.Router();
    router.get('/health-check', (req, res) => res.send('OK'));
    controllers.forEach(controller => {
      router.use(controller.path, controller.routes);
    });
    this.app.use(router);
  }

  start() {
    this.app.listen(this.port, () => {
      console.info(`Server started on http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
