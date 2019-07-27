import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import role from './role';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('role route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(role);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid role', done => {
    request(app)
      .get('/1')
      .expect(200, done);
  });

  it('returns 204 for missing role', done => {
    request(app)
      .get('/800000')
      .expect(204, done);
  });

  it('returns 404 for invalid role', done => {
    request(app)
      .get('/+d1+3')
      .expect(404, done);
  });
});
