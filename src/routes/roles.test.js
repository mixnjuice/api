import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import roles from './roles';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('roles route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(roles);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid roles', () => {
    tryCatch(done => {
      request.get('/').expect(200, done);
    });
  });

  it('returns 404 for page not found', () => {
    tryCatch(done => {
      request.get('/error').expect(404, done);
    });
  });

  it('returns valid stats', () => {
    tryCatch(done => {
      request.get('/count').expect(200, done);
    });
  });
});
