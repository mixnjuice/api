import loggers from 'modules/logging';
import { start } from './app';

const log = loggers('index');

try {
  start();
} catch (error) {
  log.error(`Fatal error: ${error}`);
}
