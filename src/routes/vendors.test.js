import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import vendors from './vendors';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('vendors route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(vendors);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid vendors', done => {
    request(app)
      .get('/?limit=20')
      .expect(200, done);
  });

  it('returns 200 vendors', done => {
    request(app)
      .get('/?offset=1000000')
      .expect(200, done);
  });

  it('returns 400 for invalid vendors', done => {
    request(app)
      .get('/?offset=stop')
      .expect(400, done);
  });

  it('returns 400 for invalid vendors #2', done => {
    request(app)
      .get('/?offset=stop')
      .expect(400, done);
  });
});
