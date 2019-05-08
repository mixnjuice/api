import { join } from 'path';
import program from 'commander';
import Postgrator from 'postgrator';

import config from './config';
import loggers from './logging';
import packageInfo from '../package.json';

const log = loggers('migrate');

const postgrator = new Postgrator({
  migrationDirectory: join(__dirname, '..', 'schema'),
  driver: 'pg',
  schemaTable: 'schemaversion',
  ...config.database,
  // need this patch because Postgrator and pg have different field names
  username: config.database.user
});

const logMigration = migration => {
  const { name, action, version } = migration;
  const apply = action === 'do';

  if (name) {
    log.info(`${apply ? 'Applied' : 'Reverted'} #${version} - ${name}`);
  } else {
    log.info(`${apply ? 'Applied' : 'Reverted'} #${version}`);
  }
};

program
  .version(packageInfo.version)
  .arguments('[target]')
  .action(async target => {
    try {
      const applied = await postgrator.migrate(target ? target : 'max');

      if (applied === []) {
        log.info('No migration needed!');
        return;
      }

      if (!Array.isArray(applied)) {
        logMigration(applied);
      }

      for (const migration of applied) {
        logMigration(migration);
      }

      log.info('Reached target migration!');
    } catch (error) {
      log.error(error.stack);
    }
  });

program.parse(process.argv);
