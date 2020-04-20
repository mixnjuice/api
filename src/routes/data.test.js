import data from './data';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('data route resource', () => {
  const app = bootstrapApp(data);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  const mockData = {
    name: 'Grosser Stuff',
    slug: 'gs',
    code: 'GS',
    density: '1.2610'
  };

  it(
    'GET returns 404 for missing route',
    tryCatch((done) => {
      request.get('/').expect(404, done);
    })
  );

  it(
    'GET returns 404 for missing route with id',
    tryCatch((done) => {
      request.get('/1').expect(404, done);
    })
  );

  it(
    'PUT returns 404 for missing route',
    tryCatch((done) => {
      request.put('/').send(mockData).expect(404, done);
    })
  );

  it(
    'POST returns 404 for missing route',
    tryCatch((done) => {
      request.post('/').send(mockData).expect(404, done);
    })
  );

  it(
    'DELETE returns 404 for deleting without an id',
    tryCatch((done) => {
      request.delete('/').expect(404, done);
    })
  );

  it(
    'GET returns 200 for data supplier id',
    tryCatch((done) => {
      request.get('/supplier/1').expect(200, done);
    })
  );

  it(
    'POST returns 200 for creating data supplier',
    tryCatch((done) => {
      request
        .post('/supplier')
        .send({ name: 'Juicy Co', code: 'JC' })
        .expect('Content-type', /json/)
        .expect(200, done);
    })
  );

  it(
    'PUT returns 200 for updating data supplier',
    tryCatch((done) => {
      request
        .put('/supplier/14')
        .send({ name: 'Juicy Co', code: 'JC' })
        .expect('Content-type', /json/)
        .expect(200, done);
    })
  );

  it(
    'DELETE returns 200 for deleting data supplier',
    tryCatch((done) => {
      request
        .delete('/supplier/14')
        .expect('Content-type', /json/)
        .expect(200, done);
    })
  );

  it(
    'GET returns 200 for data suppliers',
    tryCatch((done) => {
      request.get('/suppliers').expect(200, done);
    })
  );

  it(
    'GET returns 200 for data suppliers (paged)',
    tryCatch((done) => {
      request.get('/suppliers/?limit=20&offset=100').expect(200, done);
    })
  );

  it('returns 400 for invalid data suppliers list', () => {
    tryCatch((done) => {
      request.get('suppliers/?limit=stop').expect(400, done);
    });
  });

  it('returns 204 for invalid data suppliers list', () => {
    tryCatch((done) => {
      request.get('suppliers/?limit=0').expect(204, done);
    });
  });

  it(
    'GET returns 200 for schema version data',
    tryCatch((done) => {
      request.get('/version').expect(200, done);
    })
  );

  it('returns valid data supplier stats', () => {
    tryCatch((done) => {
      request.get('suppliers/count').expect(200, done);
    });
  });
});
