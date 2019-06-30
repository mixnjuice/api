module.exports = (sequelize, DataTypes, models) => {
  const UsersFlavors = sequelize.define(
    'UsersFlavors',
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.User,
          key: 'id'
        }
      },
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Flavor,
          key: 'id'
        }
      },
      created: {
        type: DataTypes.TIMESTAMP,
        allowNull: false
      },
      minMillipercent: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      maxMillipercent: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'users_flavors',
      createdAt: 'created',
      updatedAt: false
    }
  );

  UsersFlavors.associate = function() {
    this.belongsTo(models.User, { foreignKey: 'UserId' });
    this.belongsTo(models.Flavor, { foreignKey: 'FlavorId' });
  };

  return UsersFlavors;
};
