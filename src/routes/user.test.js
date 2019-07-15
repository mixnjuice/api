import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import user from './user';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('flavor resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(user);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid user', done => {
    request(app)
      .get('/1')
      .expect(200, done);
  });

  it('returns 204 for missing user', done => {
    request(app)
      .get('/100000000')
      .expect(204, done);
  });
  /* This test is nullified by using id(\\+d)
  it('returns 400 for invalid user', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });
  */
});
