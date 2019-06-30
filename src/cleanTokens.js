import loggers from './modules/logging';
import database from './modules/database';

const log = loggers('token-clean');

// remove all tokens that have been expired for more than three hours
database.sequelize
  .query("DELETE FROM user_token WHERE expires < now() - interval '3' hour")
  .then(results => {
    const { rowCount } = results.pop();

    log.info(`Successfully purged ${rowCount} expired tokens!`);
  })
  .catch(error => {
    log.error('Failed to purge expired tokens!');
    log.error(error.message);
    log.error(error.stack);
  })
  .finally(() => {
    database.sequelize.close();
  });
