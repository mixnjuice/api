module.exports = (sequelize, DataTypes, models) => {
  const UserToken = sequelize.define(
    'UserToken',
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: models.User,
          key: 'id'
        }
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

  UserToken.associate = function() {
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return UserToken;
};
