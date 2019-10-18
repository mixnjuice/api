import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import diluents from './diluents';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('diluents route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(diluents);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of diluents', done => {
    request.get('/').expect(200, done);
  });

  it('returns valid list of 2 diluents', done => {
    request.get('/?limit=2').expect(200, done);
  });

  it('returns 404 for invalid route', done => {
    request.get('/3').expect(404, done);
  });

  it('returns 200 diluents list', done => {
    request.get('/?offset=800000').expect(200, done);
  });

  it('returns 400 for invalid diluents list', done => {
    request.get('/?limit=stop').expect(400, done);
  });
});
