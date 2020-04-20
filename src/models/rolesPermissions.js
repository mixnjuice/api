module.exports = (sequelize, DataTypes) => {
  const RolesPermissions = sequelize.define(
    'RolesPermissions',
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Role,
          key: 'id'
        }
      },
      permissionSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.PermissionSubject,
          key: 'id'
        }
      },
      permissionActionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.PermissionAction,
          key: 'id'
        }
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'roles_permissions',
      createdAt: false,
      updatedAt: false
    }
  );

  RolesPermissions.associate = function (models) {
    this.belongsTo(models.Role, { foreignKey: 'roleId' });
    this.hasOne(models.PermissionSubject, {
      as: 'Subject',
      foreignKey: 'id',
      sourceKey: 'permissionSubjectId'
    });
    this.hasOne(models.PermissionAction, {
      as: 'Action',
      foreignKey: 'id',
      sourceKey: 'permissionActionId'
    });
  };

  return RolesPermissions;
};
