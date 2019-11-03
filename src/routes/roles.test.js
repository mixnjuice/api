import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import roles from './roles';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('roles route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(roles);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid roles', done => {
    request.get('/').expect(200, done);
  });

  it('returns 404 for page not found', done => {
    request.get('/error').expect(404, done);
  });

  it('returns valid stats', done => {
    request.get('/count').expect(200, done);
  });
});
