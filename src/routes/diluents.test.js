import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import diluents from './diluents';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('diluents route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(diluents);

  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('returns valid list of diluents', () => {
    tryCatch(done => {
      request.get('/').expect(200, done);
    });
  });

  it('returns valid list of 2 diluents', () => {
    tryCatch(done => {
      request.get('/?limit=2').expect(200, done);
    });
  });

  it('returns 404 for invalid route', () => {
    tryCatch(done => {
      request.get('/3').expect(404, done);
    });
  });

  it('returns 200 diluents list', () => {
    tryCatch(done => {
      request.get('/?offset=800000').expect(200, done);
    });
  });

  it('returns 400 for invalid diluents list', () => {
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    });
  });

  it('returns 200 diluents count', () => {
    tryCatch(done => {
      request.get('/count').expect(200, done);
    });
  });
});
