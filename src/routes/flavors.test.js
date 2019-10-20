import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import flavors from './flavors';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('flavors route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(flavors);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 flavors', done => {
    request.get('/?limit=2').expect(200, done);
  });

  it('returns 200 for missing flavors list', done => {
    request.get('/?offset=800000').expect(200, done);
  });

  it('returns 400 for invalid flavor list', done => {
    request.get('/?limit=stop').expect(400, done);
  });

  it('returns valid stats', done => {
    request(app)
      .get('/count')
      .expect(200, done);
  });
});
