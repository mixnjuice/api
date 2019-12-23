import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import recipes from './recipes';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('recipes route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(recipes);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it(
    'returns valid list of 2 recipes',
    tryCatch(done => {
      request.get('/?limit=2').expect(200, done);
    })
  );

  it(
    'returns 200 for recipes list',
    tryCatch(done => {
      request.get('/?offset=9000000').expect(200, done);
    })
  );

  it(
    'returns 400 for invalid recipes list',
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    })
  );
});
