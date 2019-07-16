import express from 'express';
// import passport from 'passport';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import configs from './modules/config';
import loggers from './modules/logging';
import bindAuth from './modules/auth';

import diluent from './routes/diluent';
import diluents from './routes/diluents';
import flavor from './routes/flavor';
import flavors from './routes/flavors';
import recipe from './routes/recipe';
import recipes from './routes/recipes';
import register from './routes/register';
import role from './routes/role';
import roles from './routes/roles';
import user from './routes/user';
import users from './routes/users';
import vendor from './routes/vendor';
import vendors from './routes/vendors';

// extract API config and create express app
const { api: config } = configs;
const log = loggers('app');

export const app = express();

export const start = async () => {
  // common middleware
  app.use(responseTime());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // setup passport
  bindAuth(app);

  // routes
  app.use('/api/diluent', diluent);
  app.use('/api/diluents', diluents);
  app.use('/api/flavor', flavor);
  app.use('/api/flavors', flavors);
  app.use('/api/recipe', recipe);
  app.use('/api/recipes', recipes);
  app.use('/api/role', role);
  app.use('/api/roles', roles);
  app.use('/api/user', user);
  app.use('/api/users', users);
  app.use('/api/vendor', vendor);
  app.use('/api/vendors', vendors);
  app.use('/register', register);

  // start the server
  const { port } = config;

  app.listen(port);
  log.info(`Listening on http://localhost:${port}`);
};
