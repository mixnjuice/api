import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import configs from './modules/config';
import loggers from './modules/logging';
import bindAuth from './modules/auth';

import data from './routes/data';
import diluent from './routes/diluent';
import diluents from './routes/diluents';
import flavor from './routes/flavor';
import flavors from './routes/flavors';
import preparation from './routes/preparation';
import preparations from './routes/preparations';
import recipe from './routes/recipe';
import recipes from './routes/recipes';
import register from './routes/register';
import role from './routes/role';
import roles from './routes/roles';
import stats from './routes/stats';
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
  app.use(cors());
  app.use(responseTime());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // setup passport
  bindAuth(app);

  // routes
  app.use('/data', data);
  app.use('/diluent', diluent);
  app.use('/diluents', diluents);
  app.use('/flavor', flavor);
  app.use('/flavors', flavors);
  app.use('/preparation', preparation);
  app.use('/preparations', preparations);
  app.use('/recipe', recipe);
  app.use('/recipes', recipes);
  app.use('/role', role);
  app.use('/roles', roles);
  app.use('/stats', stats);
  app.use('/user', user);
  app.use('/users', users);
  app.use('/vendor', vendor);
  app.use('/vendors', vendors);
  app.use('/register', register);

  // start the server
  const { port } = config;

  app.listen(port);
  log.info(`Listening on http://localhost:${port}`);
};
