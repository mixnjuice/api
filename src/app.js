import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import configs from './modules/config';
import loggers from './modules/logging';
import bindAuth from './modules/auth';

import flavor from './routes/flavor';
// import recipe from './routes/recipe';
// import vendor from './routes/vendor';
import register from './routes/register';

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
  app.use('/register', register);
  app.use('/flavor', flavor);
  // app.use('/api/recipe', recipe);
  // app.use('/api/vendor', vendor);

  // start the server
  const { port } = config;

  app.listen(port);
  log.info(`Listening on http://localhost:${port}`);
};
