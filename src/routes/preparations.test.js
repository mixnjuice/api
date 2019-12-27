import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import preparations from './preparations';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('preparations route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(preparations);

  const request = captureTestErrors(app);

  afterAll(async () => {
    await database.sequelize.close();
  });

  it('returns valid list of 2 preparations', () => {
    tryCatch(done => {
      request.get('/?limit=2').expect(200, done);
    });
  });

  it('returns 200 for preparations list', () => {
    tryCatch(done => {
      request.get('/?offset=9000000').expect(200, done);
    });
  });

  it('returns 400 for invalid preparations list', () => {
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    });
  });
});
