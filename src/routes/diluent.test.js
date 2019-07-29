import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import diluent from './diluent';
import database from '../modules/database';

describe('diluent route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(diluent);

  afterAll(() => {
    database.sequelize.close();
  });

  const date = new Date();

  const mockData = {
    name: 'Grosser Stuff' + date,
    slug: 'gs',
    code: 'GS',
    density: '1.2610'
  };

  it('POST returns 200 for creating diluent', done => {
    request(app)
      .post('/')
      .send(mockData)
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns 404 for missing id', done => {
    request(app)
      .get('/')
      .expect(404, done);
  });

  it('GET returns 200 for valid diluent', done => {
    request(app)
      .get('/2')
      .expect(200, done);
  });

  it('PUT returns 200 for updating diluent', done => {
    request(app)
      .put('/3')
      .send(mockData)
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('PUT returns 404 for updating without an id', done => {
    request(app)
      .put('/')
      .send(mockData)
      .expect(404, done);
  });

  it('GET returns 400 for invalid diluent', done => {
    request(app)
      .get('/0')
      .expect(400, done);
  });

  it('GET returns 400 for invalid diluent #2', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });

  it('DELETE returns 200 after deleting diluent', done => {
    request(app)
      .delete('/4')
      .expect(200, done);
  });

  it('DELETE returns 404 for deleting without an id', done => {
    request(app)
      .delete('/')
      .expect(404, done);
  });
});
