import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import roles from './roles';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('roles route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(roles);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid roles', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('returns 404 for page not found', done => {
    request(app)
      .get('/error')
      .expect(404, done);
  });
});
