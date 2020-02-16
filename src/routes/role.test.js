import role from './role';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('role route resource', () => {
  const app = bootstrapApp(role);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  const mockData = {
    name: 'Luser'
  };

  it('POST returns 200 for creating role', () => {
    tryCatch(done => {
      request
        .post('/')
        .send(mockData)
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns 200 for valid role', () => {
    tryCatch(done => {
      request.get('/5').expect(200, done);
    });
  });

  it('PUT returns 200 for updating role', () => {
    tryCatch(done => {
      request
        .put('/6')
        .send(mockData)
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns 400 for invalid role', () => {
    tryCatch(done => {
      request.get('/0').expect(400, done);
    });
  });

  it('GET returns 404 for invalid role route', () => {
    tryCatch(done => {
      request.get('/ham').expect(404, done);
    });
  });

  it('DELETE returns 200 after deleting role', () => {
    tryCatch(done => {
      request.delete('/15').expect(200, done);
    });
  });
});
