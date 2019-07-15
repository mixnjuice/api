import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import register from './register';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('register resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(register);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns 400 for token error', done => {
    request(app)
      .get('/activate/?code=123456')
      .expect(400, done);
  });

  it('returns 400 for token error', done => {
    request(app)
      .get('/activate')
      .expect(400, done);
  });
});
