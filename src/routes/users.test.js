import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import users from './users';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

/* eslint-disable camelcase */
describe('users route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(users);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 users', done => {
    request.get('/?limit=2').expect(200, done);
  });

  it('returns 200 for user list', done => {
    request.get('/?offset=9000000').expect(200, done);
  });

  it('returns 400 for invalid user list', done => {
    request.get('/?limit=stop').expect(400, done);
  });

  it('returns valid list of 2 user accounts', done => {
    request.get('/accounts/?limit=2').expect(200, done);
  });

  it('returns 200 for user accounts list', done => {
    request.get('/accounts/?offset=9000000').expect(200, done);
  });

  it('returns 400 for invalid user accounts list', done => {
    request.get('/accounts/?limit=stop').expect(400, done);
  });

  it('returns 200 for roles users list', done => {
    request.get('/role/1').expect(200, done);
  });

  it('returns valid stats', done => {
    request.get('/count').expect(200, done);
  });
});
