import roles from './roles';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('roles route resource', () => {
  const app = bootstrapApp(roles);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it(
    'returns valid roles',
    tryCatch((done) => {
      request.get('/').expect(200, done);
    })
  );

  it(
    'returns 404 for page not found',
    tryCatch((done) => {
      request.get('/error').expect(404, done);
    })
  );

  it(
    'returns valid stats',
    tryCatch((done) => {
      request.get('/count').expect(200, done);
    })
  );
});
