import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import AnonymousStrategy from 'passport-anonymous';

import recipeRoute from './recipe';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('recipe route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(recipeRoute);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  const mockData = {
    userId: 4,
    name: 'Testing',
    notes: 'A strawberry mint lemonade cheesecake concoction',
    RecipesFlavors: [
      {
        flavorId: 1,
        millipercent: 10
      },
      {
        flavorId: 22,
        millipercent: 50
      },
      {
        flavorId: 99,
        millipercent: 100
      }
    ],
    RecipesDiluents: [
      {
        diluentId: 1,
        millipercent: 8000
      },
      {
        diluentId: 2,
        millipercent: 1000
      }
    ]
  };

  it('can create recipe', done => {
    request
      .post('/')
      .send(mockData)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('can request valid recipe', done => {
    request
      .get('/123')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('can update existing recipe', done => {
    request
      .put('/123')
      .send(mockData)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('can delete existing recipe', done => {
    request
      .delete('/123')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns 400 for invalid number in GET request', done => {
    request
      .get('/0')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('returns 400 for string in GET request', done => {
    request
      .get('/ham')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
