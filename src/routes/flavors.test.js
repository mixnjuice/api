import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import flavors from './flavors';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('flavors route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(flavors);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 flavors', done => {
    request(app)
      .get('/?limit=2')
      .expect(
        200,
        [
          {
            id: '1',
            vendorId: 3,
            name: '27 Bears',
            slug: null,
            density: null,
            Vendor: { id: 3, name: 'Capella', slug: 'capella', code: 'CAP' }
          },
          {
            id: '2',
            vendorId: 3,
            name: '27 Fish',
            slug: null,
            density: null,
            Vendor: { id: 3, name: 'Capella', slug: 'capella', code: 'CAP' }
          }
        ],
        done
      );
  });

  it('returns 204 for missing flavors list', done => {
    request(app)
      .get('/?offset=800000')
      .expect(204, done);
  });

  it('returns 400 for invalid flavor list', done => {
    request(app)
      .get('/?limit=stop')
      .expect(400, done);
  });
});
