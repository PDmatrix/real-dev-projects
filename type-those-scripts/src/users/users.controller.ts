import * as express from 'express';

import User from './users.model';

class UsersController {
  public path = '/users';
  public routes = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routes.get('/', this.getUsers);
    this.routes.post('/', this.createUser);
  }

  private getUsers = (req, res, next) => {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
      .then(users => res.json(users))
      .catch(next);
  };

  private createUser = (req, res, next) => {
    const user = new User({
      username: req.body.username,
      mobileNumber: req.body.mobileNumber,
    });

    user
      .save()
      .then(savedUser => res.json(savedUser))
      .catch(next);
  };
}

module.exports = UsersController;
