import { Model, DataTypes } from 'sequelize';

module.exports = class UserToken extends Model {
  static init(sequelize) {
    return super.init(
      {
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        created: {
          type: DataTypes.DATE,
          allowNull: false
        },
        expires: {
          type: DataTypes.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        underscored: true,
        tableName: 'user_token',
        createdAt: 'created',
        updatedAt: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
  }
};
