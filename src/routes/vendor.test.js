import vendor from './vendor';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('vendor route resource', () => {
  const app = bootstrapApp(vendor);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('returns valid vendor', () => {
    tryCatch((done) => {
      request.get('/1').expect(200, done);
    });
  });

  it('POST creates vendor', () => {
    tryCatch((done) => {
      request
        .post('/')
        .send({
          vendorId: 3,
          name: 'Juicy Co',
          slug: 'juicy',
          code: 'JC'
        })
        .expect(200, done);
    });
  });

  it('PUT updates vendor', () => {
    tryCatch((done) => {
      request
        .put('/801')
        .send({
          vendorId: 3,
          name: 'Jucy Company',
          slug: 'juicy',
          code: 'JC'
        })
        .expect(200, done);
    });
  });

  it('DELETE deletes vendor', () => {
    tryCatch((done) => {
      request.delete('/801').expect(200, done);
    });
  });

  it('returns 200 for vendor', () => {
    tryCatch((done) => {
      request.get('/20000').expect(200, done);
    });
  });

  it('returns 400 for invalid vendor', () => {
    tryCatch((done) => {
      request.get('/ham').expect(400, done);
    });
  });

  it('GET returns valid vendor identifiers', () => {
    tryCatch((done) => {
      request.get('/1/identifiers').expect(200, done);
    });
  });

  it('GET returns valid vendor identifier', () => {
    tryCatch((done) => {
      request.get('/1/identifier/1').expect(200, done);
    });
  });

  it('POST creates valid vendor identifier', () => {
    tryCatch((done) => {
      request
        .post('/1/identifier')
        .send({ dataSupplierId: 1, identifier: 'capellar' })
        .expect(200, done);
    });
  });

  it('PUT updates valid vendor identifier', () => {
    tryCatch((done) => {
      request
        .put('/1/identifier/1')
        .send({ identifier: 'capellary' })
        .expect(200, done);
    });
  });

  it('DELETE deletes vendor identifier', () => {
    tryCatch((done) => {
      request
        .delete('/1/identifier/1')
        .send({ identifier: 'cap_27-bears' })
        .expect(200, done);
    });
  });
});
