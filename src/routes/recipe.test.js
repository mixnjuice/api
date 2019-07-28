import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import recipe from './recipe';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('recipe route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(recipe);

  afterAll(() => {
    database.sequelize.close();
  });

  const date = new Date();

  let mockData = {
    userId: 4,
    name: 'Random' + date,
    notes: 'A strawberry mint lemonade cheesecake concoction',
    RecipesFlavors: [
      {
        flavorId: 1,
        millipercent: '0.0010'
      },
      {
        flavorId: 22,
        millipercent: '0.0100'
      },
      {
        flavorId: 99,
        millipercent: '0.0200'
      }
    ],
    RecipesDiluents: [
      {
        diluentId: 1,
        millipercent: '0.8000'
      },
      {
        diluentId: 2,
        millipercent: '0.1000'
      }
    ]
  };

  describe('#1', () => {
    it('POST returns 200 for creating recipe', done => {
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
      it('GET returns 200 for valid recipe', done => {
        request(app)
          .get('/' + mockData.id)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Update our data for the next tests...
            mockData = res.body;
            mockData.name += 'blah blah blah';
            done();
          });
      });

      it('PUT returns 200 for updating recipe', done => {
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

      it('GET returns 400 for invalid recipe', done => {
        request(app)
          .get('/0')
          .expect(400, done);
      });

      it('GET returns 400 for invalid recipe', done => {
        request(app)
          .get('/ham')
          .expect(400, done);
      });

      describe('#3', () => {
        it('DELETE returns 200 after deleting recipe', done => {
          request(app)
            .delete('/' + mockData.id)
            .expect(200, done);
        });
      });
    });
  });
});
