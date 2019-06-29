import { Model, DataTypes } from 'sequelize';

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        emailAddress: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        created: {
          type: DataTypes.DATE,
          allowNull: false
        },
        activationCode: {
          type: DataTypes.STRING
        }
      },
      {
        sequelize,
        underscored: true,
        tableName: 'user',
        createdAt: 'created',
        updatedAt: false
      }
    );
  }
};
