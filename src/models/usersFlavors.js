module.exports = (sequelize, DataTypes) => {
  const UsersFlavors = sequelize.define(
    'UsersFlavors',
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.User,
          key: 'id'
        }
      },
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Flavor,
          key: 'id'
        }
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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

  UsersFlavors.associate = function(models) {
    this.belongsTo(models.User, { foreignKey: 'UserId' });
    this.belongsTo(models.Flavor, { foreignKey: 'FlavorId' });
  };

  return UsersFlavors;
};
