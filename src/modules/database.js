import Sequelize from 'sequelize';
import configs from './config';
import models from '../models';

const { host, port, password, username, database } = configs.database;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'postgres'
});

var db = models(sequelize);

db.Sequelize = Sequelize;

export default db;
