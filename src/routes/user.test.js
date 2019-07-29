import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import user from './user';
import mock from './mock';
import recipe from './recipe';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('user route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(user);
  app.use(mock);
  app.use('/recipe', recipe);

  const date = new Date();

  afterAll(() => {
    database.sequelize.close();
  });

  it('GET returns valid user', done => {
    request(app)
      .get('/7')
      .expect(200, done);
  });

  it('GET returns valid user profile', done => {
    request(app)
      .get('/7/profile')
      .expect(200, done);
  });

  it('PUT updates user profile', done => {
    request(app)
      .put('/7/profile')
      .send({
        bio: 'eMixer',
        location: 'everywhere',
        url: 'http://mixnjuice.com'
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns valid user recipes', done => {
    request(app)
      .get('/8/recipes')
      .expect(200, done);
  });

  it('POST adds user flavor', done => {
    request(app)
      .post('/9/flavor')
      .send({
        flavorId: 20,
        created: date
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns valid user flavor', done => {
    request(app)
      .get('/10/flavor/3')
      .expect(200, done);
  });

  it('DELETE deletes a user flavor', done => {
    request(app)
      .delete('/11/flavor/200')
      .expect(200, done);
  });

  it('returns 200 for missing user', done => {
    request(app)
      .get('/100000000')
      .expect(200, done);
  });

  it('returns 400 for invalid user', done => {
    request(app)
      .get('/0')
      .expect(400, done);
  });
});
