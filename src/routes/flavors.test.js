import flavors from './flavors';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('flavors route resource', () => {
  const app = bootstrapApp(flavors);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it(
    'returns valid list of 2 flavors',
    tryCatch((done) => {
      request.get('/?limit=2').expect(200, done);
    })
  );

  it(
    'returns 200 for missing flavors list',
    tryCatch((done) => {
      request.get('/?offset=800000').expect(200, done);
    })
  );

  it(
    'returns 400 for invalid flavor list',
    tryCatch((done) => {
      request.get('/?limit=stop').expect(400, done);
    })
  );

  it(
    'returns valid stats',
    tryCatch((done) => {
      request.get('/count').expect(200, done);
    })
  );
});
