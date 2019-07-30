import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import vendor from './vendor';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('vendor route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(vendor);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid vendor', done => {
    request(app)
      .get('/1')
      .expect(200, done);
  });

  it('POST creates vendor', done => {
    request(app)
      .post('/')
      .send({
        vendorId: 3,
        name: 'Juicy Co',
        slug: 'juicy',
        code: 'JC'
      })
      .expect(200, done);
  });

  it('PUT updates vendor', done => {
    request(app)
      .put('/801')
      .send({
        vendorId: 3,
        name: 'Jucy Company',
        slug: 'juicy',
        code: 'JC'
      })
      .expect(200, done);
  });

  it('DELETE deletes vendor', done => {
    request(app)
      .delete('/801')
      .expect(200, done);
  });

  it('returns 200 for vendor', done => {
    request(app)
      .get('/20000')
      .expect(200, done);
  });

  it('returns 400 for invalid vendor', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });

  it('GET returns valid vendor identifiers', done => {
    request(app)
      .get('/1/identifiers')
      .expect(200, done);
  });

  it('GET returns valid vendor identifier', done => {
    request(app)
      .get('/1/identifier/1')
      .expect(200, done);
  });

  it('POST creates valid vendor identifier', done => {
    request(app)
      .post('/1/identifier')
      .send({ dataSupplierId: 1, identifier: 'capellar' })
      .expect(200, done);
  });

  it('PUT updates valid vendor identifier', done => {
    request(app)
      .put('/1/identifier/1')
      .send({ identifier: 'capellary' })
      .expect(200, done);
  });

  it('DELETE deletes vendor identifier', done => {
    request(app)
      .delete('/1/identifier/1')
      .send({ identifier: 'cap_27-bears' })
      .expect(200, done);
  });
});
