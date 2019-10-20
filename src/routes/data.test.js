import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import data from './data';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('data route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(data);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  const mockData = {
    name: 'Grosser Stuff',
    slug: 'gs',
    code: 'GS',
    density: '1.2610'
  };

  it('GET returns 404 for missing route', done => {
    request.get('/').expect(404, done);
  });

  it('GET returns 404 for missing route with id', done => {
    request.get('/1').expect(404, done);
  });

  it('PUT returns 404 for missing route', done => {
    request
      .put('/')
      .send(mockData)
      .expect(404, done);
  });

  it('POST returns 404 for missing route', done => {
    request
      .post('/')
      .send(mockData)
      .expect(404, done);
  });

  it('DELETE returns 404 for deleting without an id', done => {
    request.delete('/').expect(404, done);
  });

  it('GET returns 200 for data supplier id', done => {
    request.get('/supplier/1').expect(200, done);
  });

  it('POST returns 200 for creating data supplier', done => {
    request
      .post('/supplier')
      .send({ name: 'Juicy Co', code: 'JC' })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('PUT returns 200 for updating data supplier', done => {
    request
      .put('/supplier/14')
      .send({ name: 'Juicy Co', code: 'JC' })
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('DELETE returns 200 for deleting data supplier', done => {
    request
      .delete('/supplier/14')
      .expect('Content-type', /json/)
      .expect(200, done);
  });

  it('GET returns 200 for data suppliers', done => {
    request.get('/suppliers').expect(200, done);
  });

  it('GET returns 200 for schema version data', done => {
    request.get('/version').expect(200, done);
  });
});
