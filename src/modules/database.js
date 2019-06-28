import globby from 'globby';
import { join } from 'path';
import Sequelize from 'sequelize';

import configs from './config';
import loggers from './logging';

const log = loggers('database');
const { host, port, password, username, database } = configs.database;

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'postgres'
});

export const loadModels = async () => {
  try {
    const modelPaths = await globby(join(__dirname, '..', 'models', '*.js'));

    for (const modelPath of modelPaths) {
      sequelize.import(modelPath);
    }
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
  }
};

export default sequelize.models;
