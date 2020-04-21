import diluent from './diluent';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('diluent route resource', () => {
  const app = bootstrapApp(diluent);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  const mockData = {
    name: 'Grosser Stuff',
    slug: 'gs',
    code: 'GS',
    density: 1.2611
  };

  it('POST returns 200 for creating diluent', () => {
    tryCatch((done) => {
      request
        .post('/')
        .send(mockData)
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns 404 for missing id', () => {
    tryCatch((done) => {
      request.get('/').expect(404, done);
    });
  });

  it('GET returns 200 for valid diluent', () => {
    tryCatch((done) => {
      request.get('/2').expect(200, done);
    });
  });

  it('PUT returns 200 for updating diluent', () => {
    tryCatch((done) => {
      request
        .put('/3')
        .send(mockData)
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('PUT returns 404 for updating without an id', () => {
    tryCatch((done) => {
      request.put('/').send(mockData).expect(404, done);
    });
  });

  it('GET returns 400 for invalid diluent', () => {
    tryCatch((done) => {
      request.get('/0').expect(400, done);
    });
  });

  it('GET returns 400 for invalid diluent #2', () => {
    tryCatch((done) => {
      request.get('/ham').expect(400, done);
    });
  });

  it('DELETE returns 200 after deleting diluent', () => {
    tryCatch((done) => {
      request.delete('/4').expect(200, done);
    });
  });

  it('DELETE returns 404 for deleting without an id', () => {
    tryCatch((done) => {
      request.delete('/').expect(404, done);
    });
  });
});
