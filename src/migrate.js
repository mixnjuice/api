import { join } from 'path';
import program from 'commander';
import Postgrator from 'postgrator';

import config from './modules/config';
import loggers from './modules/logging';
import packageInfo from '../package.json';

const log = loggers('migrate');

const postgrator = new Postgrator({
  migrationDirectory: join(__dirname, '..', 'schema'),
  driver: 'pg',
  schemaTable: 'schemaversion',
  ...config.database
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

      if (applied.length === 0) {
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
      const {
        stack,
        code = 'unknown',
        detail,
        position,
        schema,
        table,
        column
      } = error;

      let message = `Code ${code} `;

      if (schema && table) {
        message += `on ${schema}.${table} `;

        if (column) {
          message += `.${column}`;
        }
      } else {
        message += `at offset ${position} `;
      }

      if (detail) {
        message += `- ${detail}`;
      }

      log.error(message);
      log.error(stack);
    }
  });

program.parse(process.argv);
