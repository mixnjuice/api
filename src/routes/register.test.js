import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import AnonymousStrategy from 'passport-anonymous';

import register from './register';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('register route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(register);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('can register user', done => {
    request
      .post('/')
      .send({
        emailAddress: 'example@example.com',
        password: '12oj08ajf',
        username: 'mixnjuice'
      })
      .expect(200, done);
  });

  it('returns 400 for registration error (no data)', done => {
    request.post('/').expect(400, done);
  });

  it('returns 400 for token error (invalid token)', done => {
    request.get('/activate/?code=123456').expect(400, done);
  });

  it('returns 400 for token error (missing token)', done => {
    request.get('/activate').expect(400, done);
  });
});
