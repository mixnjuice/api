module.exports = (sequelize, DataTypes, models) => {
  const UsersRoles = sequelize.define(
    'UsersRoles',
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
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Role,
          key: 'id'
        }
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      created: {
        type: DataTypes.TIMESTAMP,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'users_roles',
      createdAt: 'created',
      updatedAt: false
    }
  );

  UsersRoles.associate = function() {
    this.belongsTo(models.User, { foreignKey: 'UserId' });
    this.belongsTo(models.Role, { foreignKey: 'RoleId' });
  };

  return UsersRoles;
};
