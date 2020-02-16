import users from './users';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('users route resource', () => {
  const app = bootstrapApp(users);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('returns valid list of 2 users', () => {
    tryCatch(done => {
      request.get('/?limit=2').expect(200, done);
    });
  });

  it('returns 200 for user list', () => {
    tryCatch(done => {
      request.get('/?offset=9000000').expect(200, done);
    });
  });

  it('returns 400 for invalid user list', () => {
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    });
  });

  it('returns valid list of 2 user accounts', () => {
    tryCatch(done => {
      request.get('/accounts/?limit=2').expect(200, done);
    });
  });

  it('returns 200 for user accounts list', () => {
    tryCatch(done => {
      request.get('/accounts/?offset=9000000').expect(200, done);
    });
  });

  it('returns 400 for invalid user accounts list', () => {
    tryCatch(done => {
      request.get('/accounts/?limit=stop').expect(400, done);
    });
  });

  it('returns 200 for roles users list', () => {
    tryCatch(done => {
      request.get('/role/1').expect(200, done);
    });
  });

  it('returns valid stats', () => {
    tryCatch(done => {
      request.get('/count').expect(200, done);
    });
  });
});
