import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import role from './role';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('role route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(role);

  afterAll(() => {
    database.sequelize.close();
  });

  const date = new Date();

  let mockData = {
    name: 'Luser' + date
  };

  describe('#1', () => {
    it('POST returns 200 for creating role', done => {
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
      it('GET returns 200 for valid role', done => {
        request(app)
          .get('/' + mockData.id)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Update our data for the next tests...
            mockData = res.body;
            mockData.name = 'Winner' + date;
            done();
          });
      });

      it('PUT returns 200 for updating role', done => {
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

      it('GET returns 204 for invalid role', done => {
        request(app)
          .get('/0')
          .expect(204, done);
      });

      it('GET returns 404 for invalid role', done => {
        request(app)
          .get('/ham')
          .expect(404, done);
      });

      describe('#3', () => {
        it('DELETE returns 200 after deleting role', done => {
          request(app)
            .delete('/' + mockData.id)
            .expect(200, done);
        });
      });
    });
  });
});
