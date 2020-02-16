import vendors from './vendors';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('vendors route resource', () => {
  const app = bootstrapApp(vendors);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('returns valid list of vendors', () => {
    tryCatch(done => {
      request.get('/').expect(200, done);
    });
  });

  it('returns valid vendors limit 20', () => {
    tryCatch(done => {
      request.get('/?limit=20').expect(200, done);
    });
  });

  it('returns 200 vendors offset', () => {
    tryCatch(done => {
      request.get('/?offset=1000000').expect(200, done);
    });
  });

  it('returns 400 for invalid vendors', () => {
    tryCatch(done => {
      request.get('/?offset=stop').expect(400, done);
    });
  });

  it('returns 400 for invalid vendors #2', () => {
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    });
  });

  it('returns 200 vendors count', () => {
    tryCatch(done => {
      request.get('/count').expect(200, done);
    });
  });
});
