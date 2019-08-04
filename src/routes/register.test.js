import express from 'express';
import request from 'supertest';
import passport from 'passport';
import bodyParser from 'body-parser';
import AnonymousStrategy from 'passport-anonymous';

import register from './register';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('register route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(register);

  afterAll(() => {
    database.sequelize.close();
  });

  it('can register user', done => {
    request(app)
      .post('/')
      .send({
        emailAddress: 'example@example.com',
        password: '12oj08ajf',
        username: 'mixnjuice'
      })
      .expect(200, done);
  });

  it('returns 400 for registration error (no data)', done => {
    request(app)
      .post('/')
      .expect(400, done);
  });

  it('returns 400 for token error (invalid token)', done => {
    request(app)
      .get('/activate/?code=123456')
      .expect(400, done);
  });

  it('returns 400 for token error (missing token)', done => {
    request(app)
      .get('/activate')
      .expect(400, done);
  });
});
