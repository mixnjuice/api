import passport from 'passport';

import recipeRoute from './recipe';
import database from 'modules/database';
import { useMockStrategy } from 'modules/auth';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('recipe route resource', () => {
  useMockStrategy(passport, { id: 1 });

  const app = bootstrapApp(recipeRoute);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  const mockData = {
    userId: 4,
    name: 'Testing',
    version: 1,
    notes: 'A strawberry mint lemonade cheesecake concoction',
    volumeMl: 60,
    flavors: [
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
    recipeDiluents: [
      {
        diluentId: 1,
        millipercent: 8000
      },
      {
        diluentId: 2,
        millipercent: 1000
      }
    ],
    preparationDiluents: []
  };

  it('can create recipe', () => {
    tryCatch(done => {
      request
        .post('/')
        .send(mockData)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can request valid recipe', () => {
    tryCatch(done => {
      request
        .get('/123')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can update existing recipe', () => {
    tryCatch(done => {
      request
        .put('/123')
        .send(mockData)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('can delete existing recipe', () => {
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
