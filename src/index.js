import configs from './modules/config';
import loggers from './modules/logging';
import { app } from './app';

// extract web config, create logger and express app
const { web: config } = configs;
const log = loggers('app');

try {
  const { port } = config;

  // start the server
  log.info(`Listening on http://localhost:${port}`);
  app.listen(port);
} catch (error) {
  log.error(`Fatal error: ${error}`);
}
