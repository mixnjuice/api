import pick from 'lodash/pick';
import SequelizeMock from 'sequelize-mock';
import Sequelize, { ValidationError, DatabaseError } from 'sequelize';

import logging from './logging';
import configs from './config';
import models from '../models';
import { isTestEnvironment } from './util';

const log = logging('database');
const { host, port, password, username, database } = configs.database;
const validationProps = ['message', 'type', 'path', 'value'];

const sequelize = isTestEnvironment()
  ? new SequelizeMock()
  : new Sequelize(database, username, password, {
      host,
      port,
      dialect: 'postgres'
    });

export const handleError = (error, res = {}) => {
  log.error(error.message);
  log.error(error.stack);

  let response = null;

  if (error instanceof ValidationError) {
    const { errors } = error;

    response = {
      errors: errors.map(validationError =>
        pick(validationError, validationProps)
      )
    };
  } else if (error instanceof DatabaseError) {
    response = {
      message: 'An unexpected database error occurred.',
      type: 'db_error'
    };
  }

  if (res && response) {
    res.status(500).json(response);
  } else if (res) {
    res.status(500).end();
  }
};

const db = models(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
