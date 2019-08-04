import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import preparations from './preparations';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('preparations route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(preparations);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 preparations', done => {
    request(app)
      .get('/?limit=2')
      .expect(200, done);
  });

  it('returns 200 for preparations list', done => {
    request(app)
      .get('/?offset=9000000')
      .expect(200, done);
  });

  it('returns 400 for invalid preparations list', done => {
    request(app)
      .get('/?limit=stop')
      .expect(400, done);
  });
});
