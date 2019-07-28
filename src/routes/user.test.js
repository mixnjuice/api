import express from 'express';
import request from 'supertest';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';
import bodyParser from 'body-parser';

import user from './user';
import mock from './mock';
import recipe from './recipe';
import database from '../modules/database';

/* eslint-disable camelcase */
describe('user route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(user);
  app.use(mock);
  app.use('/recipe', recipe);

  let mockUser = {};

  let mockRecipe = {};

  let mockFlavor = {};

  const date = new Date();

  afterAll(() => {
    database.sequelize.close();
  });

  describe('#1', () => {
    it('Create Mock User', done => {
      request(app)
        .post('/mock/user')
        .send({})
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          // Mock User Account
          mockUser = res.body;
          done();
        });
    });
    describe('#2', () => {
      it('Create Mock User Profile', done => {
        request(app)
          .post('/mock/user/' + mockUser.id + '/profile')
          .send({})
          .expect('Content-type', /json/)
          .expect(200, done);
      });
      it('Create Mock User Recipe', done => {
        request(app)
          .post('/recipe')
          .send({
            userId: mockUser.id,
            name: 'Random' + date,
            notes: 'A strange inedible arrangement',
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
          })
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Mock User Recipe
            mockRecipe = res.body;
            done();
          });
      });
    });
    describe('#3', () => {
      it('GET returns valid user', done => {
        request(app)
          .get('/' + mockUser.id)
          .expect(200, done);
      });
      it('GET returns valid user profile', done => {
        request(app)
          .get('/' + mockUser.id + '/profile')
          .expect(200, done);
      });
      it('PUT updates user profile', done => {
        request(app)
          .put('/' + mockUser.id + '/profile')
          .send({
            bio: 'eMixer',
            location: 'everywhere',
            url: 'http://mixnjuice.com'
          })
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(res);
            }
            done();
          });
      });
      it('GET returns valid user recipes', done => {
        request(app)
          .get('/' + mockUser.id + '/recipes')
          .expect(200, done);
      });
      it('POST adds user flavor', done => {
        request(app)
          .post('/' + mockUser.id + '/flavor')
          .send({
            flavorId: 20,
            created: date
          })
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Mock User Account
            mockFlavor = res.body;
            done();
          });
      });
      it('GET returns valid user flavor', done => {
        request(app)
          .get('/' + mockUser.id + '/flavor/' + mockFlavor.flavorId)
          .expect(200, done);
      });
      it('DELETE deletes a user flavor', done => {
        request(app)
          .delete('/' + mockUser.id + '/flavor/' + mockFlavor.flavorId)
          .expect(200, done);
      });
      describe('#4', () => {
        it('Delete Mock User Recipe', done => {
          request(app)
            .delete('/recipe/' + mockRecipe.id)
            .expect(200, done);
        });
        it('Delete Mock User Profile', done => {
          request(app)
            .delete('/mock/user/' + mockUser.id + '/profile')
            .expect(200, done);
        });
        describe('#Final', () => {
          it('Delete Mock User', done => {
            request(app)
              .delete('/mock/user/' + mockUser.id)
              .expect(200, done);
          });
        });
      });
    });
  });

  it('returns 204 for missing user', done => {
    request(app)
      .get('/100000000')
      .expect(204, done);
  });
  /* This test is nullified by using id(\\+d)
  it('returns 400 for invalid user', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });
  */
});
