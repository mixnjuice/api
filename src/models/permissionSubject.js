module.exports = (sequelize, DataTypes) => {
  const PermissionSubject = sequelize.define(
    'PermissionSubject',
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
      tableName: 'permission_subject',
      createdAt: false,
      updatedAt: false
    }
  );

  PermissionSubject.associate = function(models) {
    this.hasMany(models.RolesPermissions, {
      as: 'RolesPermissions',
      foreignKey: 'permissionSubjectId'
    });
  };

  return PermissionSubject;
};
