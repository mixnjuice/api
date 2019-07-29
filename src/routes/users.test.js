import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import users from './users';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('users route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(users);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 users', done => {
    request(app)
      .get('/?limit=2')
      .expect(200, done);
  });

  it('returns 200 for user list', done => {
    request(app)
      .get('/?offset=9000000')
      .expect(200, done);
  });

  it('returns 400 for invalid user list', done => {
    request(app)
      .get('/?limit=stop')
      .expect(400, done);
  });

  it('returns valid list of 2 user accounts', done => {
    request(app)
      .get('/accounts/?limit=2')
      .expect(200, done);
  });

  it('returns 200 for user accounts list', done => {
    request(app)
      .get('/accounts/?offset=9000000')
      .expect(200, done);
  });

  it('returns 400 for invalid user accounts list', done => {
    request(app)
      .get('/accounts/?limit=stop')
      .expect(400, done);
  });
});
