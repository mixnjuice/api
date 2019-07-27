import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import diluent from './diluent';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('diluent route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(diluent);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid diluent', done => {
    request(app)
      .get('/1')
      .expect(200, done);
  });

  it('returns 204 for missing diluent', done => {
    request(app)
      .get('/800000')
      .expect(204, done);
  });

  it('returns 400 for invalid diluent list', done => {
    request(app)
      .get('/%sd5')
      .expect(400, done);
  });
});
