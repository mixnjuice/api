import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import stats from './stats';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('stats route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(stats);

  afterAll(() => {
    database.sequelize.close();
  });
  /**
   * Apparently sequelize-mock doesn't support Model.count()...  :(
   *
  it('returns valid stats', done => {
    request(app)
      .get('/dashboard')
      .expect(200, done);
  });
   */

  it('returns 404 for page not found', done => {
    request(app)
      .get('/error')
      .expect(404, done);
  });
});
