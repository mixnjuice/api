module.exports = (sequelize, DataTypes) => {
  const PermissionAction = sequelize.define(
    'PermissionAction',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'permission_action',
      createdAt: false,
      updatedAt: false
    }
  );

  PermissionAction.associate = function(models) {
    this.hasMany(models.RolesPermissions, {
      as: 'RolesPermissions',
      foreignKey: 'permissionActionId'
    });
  };

  return PermissionAction;
};
