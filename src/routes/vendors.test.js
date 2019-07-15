import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import vendors from './vendors';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('vendors route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(vendors);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid vendors', done => {
    request(app)
      .get('/?limit=20')
      .expect(
        200,
        [
          { id: 1, name: 'Baker Flavors', slug: 'baker-flavors', code: 'BF' },
          { id: 2, name: 'Bickford', slug: 'bickford', code: 'BFD' },
          { id: 3, name: 'Capella', slug: 'capella', code: 'CAP' },
          { id: 4, name: "Chef's Choice", slug: 'chefs-choice', code: 'CC' },
          { id: 5, name: "Chef's Flavors", slug: 'chefs-flavors', code: 'CHF' },
          { id: 6, name: 'Clyrolinx', slug: 'clyrolinx', code: 'CLY' },
          {
            id: 7,
            name: 'Decadent Vapours',
            slug: 'decadent-vapours',
            code: 'DV'
          },
          { id: 8, name: 'Delosi', slug: 'delosi', code: 'DF' },
          {
            id: 9,
            name: 'DIY Flavor Shack',
            slug: 'diy-flavor-shack',
            code: 'DFS'
          },
          { id: 10, name: 'DIY OR DIE', slug: 'diy-or-die', code: 'DOD' },
          { id: 11, name: 'DKS', slug: 'dks', code: 'DKS' },
          { id: 12, name: 'DuoMei', slug: 'duomei', code: 'DUO' },
          {
            id: 13,
            name: 'E Juice Makers',
            slug: 'e-juice-makers',
            code: 'EJM'
          },
          { id: 14, name: 'Euro Flavors', slug: 'euro-flavors', code: 'EUR' },
          {
            id: 15,
            name: 'Faeries Finest',
            slug: 'faeries-finest',
            code: 'FF'
          },
          { id: 16, name: 'Flavor Bases', slug: 'flavor-bases', code: 'BASE' },
          {
            id: 17,
            name: 'Flavor Pheonix',
            slug: 'flavor-pheonix',
            code: 'FP'
          },
          {
            id: 18,
            name: 'Flavor Revolution',
            slug: 'flavor-revolution',
            code: 'FR'
          },
          { id: 19, name: 'Flavor West', slug: 'flavor-west', code: 'FW' },
          { id: 20, name: 'Flavorah', slug: 'flavorah', code: 'FLV' }
        ],
        done
      );
  });

  it('returns 204 for missing vendors', done => {
    request(app)
      .get('/?offset=1000000')
      .expect(204, done);
  });

  it('returns 400 for invalid vendors', done => {
    request(app)
      .get('/?offset=stop')
      .expect(400, done);
  });

  it('returns 400 for invalid vendors', done => {
    request(app)
      .get('/?offset=stop')
      .expect(400, done);
  });
});
