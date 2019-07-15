import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import recipe from './recipe';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('recipe route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(recipe);

  afterAll(() => {
    database.sequelize.close();
  });
  /*
  it('returns valid vendors', done => {
    request(app)
      .get('/1')
      .expect(
        200,
        {
          // Recipe Data
        },
        done
      );
  });
*/
  it('returns 204 for missing recipe', done => {
    request(app)
      .get('/99999999999999999999')
      .expect(204, done);
  });

  it('returns 400 for invalid recipe', done => {
    request(app)
      .get('/0')
      .expect(400, done);
  });

  it('returns 400 for invalid recipe', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });
});
