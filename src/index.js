import express from 'express';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import configs from './config';
import loggers from './logging';

import flavor from './routes/flavor';
// import recipe from './routes/recipe';
// import vendor from './routes/vendor';

// extract web config, create logger and express app
const { web: config } = configs;
const log = loggers('api');
const app = express();

try {
  // common middleware
  app.use(responseTime());
  app.use(bodyParser.json());
  app.use((req, _, next) => {
    log.info(`request for ${req.path}`);
    next();
  });

  // routes
  app.use('/flavor', flavor);
  // app.use('/recipe', recipe);
  // app.use('/vendor', vendor);

  // start the server
  log.info(`Listening on http://localhost:${config.port}`);
  app.listen(config.port);
} catch (error) {
  log.error(`Fatal error: ${error.message}`);
}
