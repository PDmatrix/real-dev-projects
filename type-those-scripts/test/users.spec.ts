import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import mongoose from 'mongoose';

import app from '@app/index';

chai.use(chaiHttp);

before(done => {
  mongoose.connection.dropDatabase(done);
});

describe('Users API', () => {
  it('should list empty users', async () => {
    const emptyUsers = await chai.request(app).get('/users');
    chai.expect(emptyUsers.body).to.eql([]);
  });

  let user: any = {
    username: 'Real',
    mobileNumber: '1234567890',
  };
  it('should create a new user', async () => {
    const createUserResponse = await chai
      .request(app)
      .post('/users')
      .send(user);

    chai.expect(createUserResponse.status).eql(200);
    chai.expect(createUserResponse.body).deep.include(user);
    user = createUserResponse.body;
  });

  it('should list the created user', async () => {
    const users = await chai.request(app).get('/users');
    chai.expect(users.body).deep.equal([user]);
  });
});
