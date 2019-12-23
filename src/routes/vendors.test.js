import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import vendors from './vendors';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('vendors route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(vendors);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid vendors', () => {
    tryCatch(done => {
      request.get('/?limit=20').expect(200, done);
    });
  });

  it('returns 200 vendors', () => {
    tryCatch(done => {
      request.get('/?offset=1000000').expect(200, done);
    });
  });

  it('returns 400 for invalid vendors', () => {
    tryCatch(done => {
      request.get('/?offset=stop').expect(400, done);
    });
  });

  it('returns 400 for invalid vendors #2', () => {
    tryCatch(done => {
      request.get('/?offset=stop').expect(400, done);
    });
  });
});
