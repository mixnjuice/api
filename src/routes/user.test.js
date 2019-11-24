import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import user from './user';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('user route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(user);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('GET returns valid user', done => {
    request.get('/7').expect(200, done);
  });

  it('GET returns valid user profile', done => {
    request.get('/7/profile').expect(200, done);
  });

  it('PUT updates user profile', done => {
    request
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
    request.get('/8/recipes').expect(200, done);
  });

  it('POST adds user flavor', done => {
    request
      .post('/9/flavor')
      .send({
        flavorId: 20
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns valid user flavor', done => {
    request.get('/10/flavor/3').expect(200, done);
  });

  it('PUT updates user flavor', done => {
    request
      .put('/7/flavor/123')
      .send({
        minMillipercent: 50,
        maxmillipercent: 500
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns valid user flavors', done => {
    request.get('/10/flavors').expect(200, done);
  });

  it('DELETE deletes a user flavor', done => {
    request.delete('/11/flavor/200').expect(200, done);
  });

  it('GET returns valid user roles', done => {
    request.get('/10/roles').expect(200, done);
  });

  it('GET returns a valid user role', done => {
    request.get('/10/role/1').expect(200, done);
  });

  it('POST assigns a user role', done => {
    request
      .post('/9/role/')
      .send({
        roleId: 3,
        active: false
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('PUT updates a user role', done => {
    request
      .put('/9/role/3')
      .send({
        active: true
      })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('DELETE deletes a user role', done => {
    request.delete('/11/role/1').expect(200, done);
  });

  it('returns 200 for missing user', done => {
    request.get('/100000000').expect(200, done);
  });

  it('returns 400 for invalid user', done => {
    request.get('/0').expect(400, done);
  });

  it('GET current user', done => {
    request
      .get('/current')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('GET user profile', done => {
    request
      .get('/mixnjuice')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
