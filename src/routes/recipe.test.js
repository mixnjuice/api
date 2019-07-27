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
  app.use(recipe);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  afterAll(() => {
    database.sequelize.close();
  });

  let data = null;

  describe('/recipe POST', () => {
    it('returns 200 for creating recipe', done => {
      request(app)
        .post('/')
        .send({
          userid: 4,
          name: 'flavflav',
          notes: 'A strawberry mint lemonade cheesecake concoction',
          flavors: [
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
          diluents: [
            {
              diluentId: 1,
              millipercent: '0.8000'
            },
            {
              diluentId: 2,
              millipercent: '0.1000'
            }
          ]
        })
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          data = res.body;
          done();
        });
    });
    describe('/recipe PUT', () => {
      it('returns 200 for creating recipe', done => {
        data.name = 'blah blah blah again';
        request(app)
          .put('/' + data.id)
          .send(data)
          .expect(200, done);
      });
      describe('/recipe GET', () => {
        it('returns 204 for missing recipe', done => {
          request(app)
            .get('/' + data.id)
            .expect(204, done);
        });

        it('returns 400 for invalid recipe', done => {
          request(app)
            .get('/0')
            .expect(400, done);
        });

        it('returns 400 for invalid recipe', done => {
          request(app)
            .get('/ham')
            .expect(400, done);
        });
        describe('/recipe DELETE', () => {
          it('returns 400 for invalid recipe', done => {
            request(app)
              .delete('/' + data.id)
              .expect(400, done);
          });
        });
      });
    });
  });
});
