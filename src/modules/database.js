// import globby from 'globby';
// import { join } from 'path';
import Sequelize from 'sequelize';
import configs from './config';
import models from '../models';
// import loggers from './logging';

// const log = loggers('database');
const { host, port, password, username, database } = configs.database;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'postgres'
});
/*
export const loadModels = async () => {
  try {
    const modelPaths = await globby(join(__dirname, '..', 'models', '*.js'));

    const models = modelPaths.reduce((result, modelPath) => {
      const Model = require(modelPath);

      const model = Model.init(sequelize);

      return {
        ...result,
        [Model.name]: model
      };
    }, {});

    for (const model of Object.values(models)) {
      if (typeof model.associate === 'function') {
        model.associate(models);
      }
    }
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
  }
};
*/

var db = models(sequelize);

db.Sequelize = Sequelize;

export default db;
