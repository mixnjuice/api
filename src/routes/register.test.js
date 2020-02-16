import register from './register';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('register route resource', () => {
  const app = bootstrapApp(register);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it('can register user', () => {
    tryCatch(done => {
      request
        .post('/')
        .send({
          emailAddress: 'example@example.com',
          password: '12oj08ajf',
          username: 'mixnjuice'
        })
        .expect(200, done);
    });
  });

  it('returns 400 for registration error (no data)', () => {
    tryCatch(done => {
      request.post('/').expect(400, done);
    });
  });

  it('returns 400 for token error (invalid token)', () => {
    tryCatch(done => {
      request.get('/activate/?code=123456').expect(400, done);
    });
  });

  it('returns 400 for token error (missing token)', () => {
    tryCatch(done => {
      request.get('/activate').expect(400, done);
    });
  });
});
