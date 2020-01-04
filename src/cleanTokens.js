import dayjs from 'dayjs';

import loggers from 'modules/logging';
import models from 'modules/database';

const log = loggers('token-clean');
const { Op } = models.Sequelize;
const { UserToken } = models;

// remove all tokens that have been expired for more than three hours
UserToken.destroy({
  where: {
    expires: {
      [Op.lt]: dayjs().add(-3, 'hour')
    }
  }
})
  .then(rowCount => {
    log.info(`Successfully purged ${rowCount} expired tokens!`);
  })
  .catch(error => {
    log.error('Failed to purge expired tokens!');
    log.error(error.message);
    log.error(error.stack);
  })
  .finally(() => {
    models.sequelize.close();
  });
