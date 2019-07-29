import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import diluents from './diluents';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('diluents route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(diluents);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 diluents', done => {
    request(app)
      .get('/?limit=2')
      .expect(200, done);
  });

  it('returns 200 diluents list', done => {
    request(app)
      .get('/?offset=800000')
      .expect(200, done);
  });

  it('returns 400 for invalid diluents list', done => {
    request(app)
      .get('/?limit=stop')
      .expect(400, done);
  });
});
