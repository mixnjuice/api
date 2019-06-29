import express from 'express';
// import passport from 'passport';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import configs from './modules/config';
import loggers from './modules/logging';
import bindAuth from './modules/auth';
// import { loadModels } from './modules/database';

import flavor from './routes/flavor';
// import recipe from './routes/recipe';
// import vendor from './routes/vendor';

// extract web config and create express app
const { web: config } = configs;
const log = loggers('app');

export const app = express();

export const start = async () => {
  //  await loadModels();

  // common middleware
  app.use(responseTime());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // setup passport
  bindAuth(app);

  // routes
  app.use('/flavor', flavor);
  // app.use('/recipe', recipe);
  // app.use('/vendor', vendor);

  // start the server
  const { port } = config;

  app.listen(port);
  log.info(`Listening on http://localhost:${port}`);
};
