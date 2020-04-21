import user from './user';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('user route resource', () => {
  const app = bootstrapApp(user);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('GET returns valid user', () => {
    tryCatch((done) => {
      request.get('/7').expect(200, done);
    });
  });

  it('GET returns valid user profile', () => {
    tryCatch((done) => {
      request.get('/7/profile').expect(200, done);
    });
  });

  it('PUT updates user profile', () => {
    tryCatch((done) => {
      request
        .put('/7/profile')
        .send({
          bio: 'eMixer',
          location: 'everywhere',
          url: 'http://mixnjuice.com'
        })
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns valid user recipes', () => {
    tryCatch((done) => {
      request.get('/8/recipes').expect(200, done);
    });
  });

  it('POST adds user flavor', () => {
    tryCatch((done) => {
      request
        .post('/9/flavor')
        .send({
          flavorId: 20
        })
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns valid user flavor', () => {
    tryCatch((done) => {
      request.get('/10/flavor/3').expect(200, done);
    });
  });

  it('PUT updates user flavor', () => {
    tryCatch((done) => {
      request
        .put('/7/flavor/123')
        .send({
          minMillipercent: 50,
          maxmillipercent: 500
        })
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('GET returns valid user flavors', () => {
    tryCatch((done) => {
      request.get('/10/flavors').expect(200, done);
    });
  });

  it('DELETE deletes a user flavor', () => {
    tryCatch((done) => {
      request.delete('/11/flavor/200').expect(200, done);
    });
  });

  it('GET returns valid user roles', () => {
    tryCatch((done) => {
      request.get('/10/roles').expect(200, done);
    });
  });

  it('GET returns a valid user role', () => {
    tryCatch((done) => {
      request.get('/10/role/1').expect(200, done);
    });
  });

  it('POST assigns a user role', () => {
    tryCatch((done) => {
      request
        .post('/9/role/')
        .send({
          roleId: 3,
          active: false
        })
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('PUT updates a user role', () => {
    tryCatch((done) => {
      request
        .put('/9/role/3')
        .send({
          active: true
        })
        .expect('Content-type', /json/)
        .expect(200, done);
    });
  });

  it('DELETE deletes a user role', () => {
    tryCatch((done) => {
      request.delete('/11/role/1').expect(200, done);
    });
  });

  it('returns 200 for missing user', () => {
    tryCatch((done) => {
      request.get('/100000000').expect(200, done);
    });
  });

  it('returns 400 for invalid user', () => {
    tryCatch((done) => {
      request.get('/0').expect(400, done);
    });
  });

  it('GET current user', () => {
    tryCatch((done) => {
      request.get('/current').expect('Content-Type', /json/).expect(200, done);
    });
  });

  it('GET user profile', () => {
    tryCatch((done) => {
      request
        .get('/name/mixnjuice')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
