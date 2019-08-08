import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

import app from '@app/index';

chai.use(chaiHttp);

describe('Health check', () => {
  it('should return OK', async () => {
    return chai
      .request(app)
      .get('/health-check')
      .then(res => {
        chai.expect(res.text).to.eql('OK');
      });
  });
});
