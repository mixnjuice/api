import stats from './stats';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('stats route resource', () => {
  const app = bootstrapApp(stats);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('returns valid stats', () => {
    tryCatch((done) => {
      request.get('/dashboard').expect(200, done);
    });
  });

  it('returns 404 for page not found', () => {
    tryCatch((done) => {
      request.get('/error').expect(404, done);
    });
  });
});
