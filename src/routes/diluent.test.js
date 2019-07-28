import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import diluent from './diluent';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('diluent route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(diluent);

  afterAll(() => {
    database.sequelize.close();
  });

  let mockData = {
    name: 'Grosser Stuff',
    slug: 'gs',
    code: 'GS',
    density: '1.2610'
  };

  describe('#1', () => {
    it('POST returns 200 for creating diluent', done => {
      request(app)
        .post('/')
        .send(mockData)
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          // Update our data for the next tests...
          mockData.id = res.body.id;
          done();
        });
    });

    describe('#2', () => {
      it('GET returns 200 for valid diluent', done => {
        request(app)
          .get('/' + mockData.id)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Update our data for the next tests...
            mockData = res.body;
            mockData.name = 'Gross Stuff';
            done();
          });
      });

      it('PUT returns 200 for updating diluent', done => {
        request(app)
          .put('/' + mockData.id)
          .send(mockData)
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(res);
            }
            done();
          });
      });

      it('GET returns 400 for invalid diluent', done => {
        request(app)
          .get('/0')
          .expect(400, done);
      });

      it('GET returns 400 for invalid diluent', done => {
        request(app)
          .get('/ham')
          .expect(400, done);
      });

      describe('#3', () => {
        it('DELETE returns 200 after deleting diluent', done => {
          request(app)
            .delete('/' + mockData.id)
            .expect(200, done);
        });
      });
    });
  });
});
