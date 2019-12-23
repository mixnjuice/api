import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import AnonymousStrategy from 'passport-anonymous';

import preparationRoute from './preparation';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('preparation route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(preparationRoute);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  const mockData = {
    recipeId: '17',
    userId: '1',
    volumeMl: '60',
    nicotineMillipercent: '0.0300',
    viewCount: 0,
    PreparationsDiluents: [
      {
        preparationId: '8',
        diluentId: 1,
        millipercent: 300,
        nicotineConcentration: 100
      },
      {
        preparationId: '8',
        diluentId: 1,
        millipercent: 8000,
        nicotineConcentration: 0
      },
      {
        preparationId: '8',
        diluentId: 2,
        millipercent: 1000,
        nicotineConcentration: 0
      }
    ]
  };

  it('can create preparation', () => {
    tryCatch(done => {
      request
        .post('/')
        .send(mockData)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can request valid preparation', () => {
    tryCatch(done => {
      request
        .get('/123')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can update existing preparation', () => {
    tryCatch(done => {
      request
        .put('/123')
        .send(mockData)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can delete existing preparation', () => {
    tryCatch(done => {
      request
        .delete('/123')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('returns 400 for invalid number in GET request', () => {
    tryCatch(done => {
      request
        .get('/0')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });

  it('returns 400 for string in GET request', () => {
    tryCatch(done => {
      request
        .get('/ham')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });
});
