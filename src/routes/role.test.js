import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import role from './role';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('role route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(role);

  afterAll(() => {
    database.sequelize.close();
  });

  const mockData = {
    name: 'Luser'
  };

  it('POST returns 200 for creating role', done => {
    request(app)
      .post('/')
      .send(mockData)
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns 200 for valid role', done => {
    request(app)
      .get('/5')
      .expect(200, done);
  });

  it('PUT returns 200 for updating role', done => {
    request(app)
      .put('/6')
      .send(mockData)
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns 400 for invalid role', done => {
    request(app)
      .get('/0')
      .expect(400, done);
  });

  it('GET returns 404 for invalid role route', done => {
    request(app)
      .get('/ham')
      .expect(404, done);
  });

  it('DELETE returns 200 after deleting role', done => {
    request(app)
      .delete('/15')
      .expect(200, done);
  });
});
