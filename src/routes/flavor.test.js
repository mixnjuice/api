import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import flavor from './flavor';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('flavor route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flavor);

  const request = captureTestErrors(app);

  afterAll(async () => {
    await database.sequelize.close();
  });

  it(
    'GET returns valid flavor',
    tryCatch(done => {
      request.get('/123').expect(200, done);
    })
  );

  it(
    'POST creates flavor',
    tryCatch(done => {
      request
        .post('/')
        .send({
          vendorId: 3,
          name: 'Juicy Sludge',
          slug: 'capella_juicy_sludge',
          density: '1.0300'
        })
        .expect(200, done);
    })
  );

  it(
    'PUT updates flavor',
    tryCatch(done => {
      request
        .put('/801')
        .send({
          vendorId: 3,
          name: 'Juicy Sludge',
          slug: 'capella_juicy_sludge',
          density: '1.0320'
        })
        .expect(200, done);
    })
  );

  it(
    'DELETE deletes flavor',
    tryCatch(done => {
      request.delete('/801').expect(200, done);
    })
  );

  it(
    'GET returns valid flavor identifiers',
    tryCatch(done => {
      request.get('/1/identifiers').expect(200, done);
    })
  );

  it(
    'GET returns valid flavor identifier',
    tryCatch(done => {
      request.get('/1/identifier/1').expect(200, done);
    })
  );

  it(
    'POST creates valid flavor identifier',
    tryCatch(done => {
      request
        .post('/1/identifier')
        .send({ dataSupplierId: 1, identifier: 'cap_27-bears' })
        .expect(200, done);
    })
  );

  it(
    'PUT updates valid flavor identifier',
    tryCatch(done => {
      request
        .put('/1/identifier/1')
        .send({ identifier: 'cap_27-bears' })
        .expect(200, done);
    })
  );

  it(
    'DELETE deletes flavor identifier',
    tryCatch(done => {
      request
        .delete('/1/identifier/1')
        .send({ identifier: 'cap_27-bears' })
        .expect(200, done);
    })
  );

  it(
    'returns 400 for missing flavor',
    tryCatch(done => {
      request.get('/0').expect(400, done);
    })
  );

  it(
    'returns 400 for invalid flavor',
    tryCatch(done => {
      request.get('/ham').expect(400, done);
    })
  );
});
