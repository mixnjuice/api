import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import recipes from './recipes';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('recipes route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(recipes);

  afterAll(() => {
    database.sequelize.close();
  });
  /*
  it('returns valid list of 2 recipes', done => {
    request(app)
      .get('/?limit=2')
      .expect(200, {}, done);
  }); */

  it('returns 204 for missing recipes list', done => {
    request(app)
      .get('/?offset=9000000')
      .expect(204, done);
  });

  it('returns 400 for invalid recipes list', done => {
    request(app)
      .get('/?limit=stop')
      .expect(400, done);
  });
});
