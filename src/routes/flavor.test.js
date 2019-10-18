import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import flavor from './flavor';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

/* eslint-disable camelcase */
describe('flavor route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flavor);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('GET returns valid flavor', done => {
    request.get('/123').expect(200, done);
  });

  it('POST creates flavor', done => {
    request
      .post('/')
      .send({
        vendorId: 3,
        name: 'Juicy Sludge',
        slug: 'capella_juicy_sludge',
        density: '1.0300'
      })
      .expect(200, done);
  });

  it('PUT updates flavor', done => {
    request
      .put('/801')
      .send({
        vendorId: 3,
        name: 'Juicy Sludge',
        slug: 'capella_juicy_sludge',
        density: '1.0320'
      })
      .expect(200, done);
  });

  it('DELETE deletes flavor', done => {
    request.delete('/801').expect(200, done);
  });

  it('GET returns valid flavor identifiers', done => {
    request.get('/1/identifiers').expect(200, done);
  });

  it('GET returns valid flavor identifier', done => {
    request.get('/1/identifier/1').expect(200, done);
  });

  it('POST creates valid flavor identifier', done => {
    request
      .post('/1/identifier')
      .send({ dataSupplierId: 1, identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('PUT updates valid flavor identifier', done => {
    request
      .put('/1/identifier/1')
      .send({ identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('DELETE deletes flavor identifier', done => {
    request
      .delete('/1/identifier/1')
      .send({ identifier: 'cap_27-bears' })
      .expect(200, done);
  });

  it('returns 400 for missing flavor', done => {
    request.get('/0').expect(400, done);
  });

  it('returns 400 for invalid flavor', done => {
    request.get('/ham').expect(400, done);
  });
});
