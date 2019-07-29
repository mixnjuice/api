import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import flavor from './flavor';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('flavor route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flavor);

  afterAll(() => {
    database.sequelize.close();
  });

  it('GET returns valid flavor', done => {
    request(app)
      .get('/123')
      .expect(200, done);
  });

  it('GET returns valid flavor identifiers', done => {
    request(app)
      .get('/1/identifiers')
      .expect(200, done);
  });

  it('GET returns valid flavor identifier', done => {
    request(app)
      .get('/1/identifier/1')
      .expect(200, done);
  });

  it('POST creates valid flavor identifier', done => {
    request(app)
      .post('/1/identifier')
      .send({ dataSupplierId: 1, identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('PUT updates valid flavor identifier', done => {
    request(app)
      .put('/1/identifier/1')
      .send({ identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('DELETE deletes flavor identifier', done => {
    request(app)
      .delete('/1/identifier/1')
      .send({ identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('returns 400 for missing flavor', done => {
    request(app)
      .get('/0')
      .expect(400, done);
  });

  it('returns 400 for invalid flavor', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });
});
