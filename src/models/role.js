module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'role',
      createdAt: false,
      updatedAt: false
    }
  );

  Role.associate = function(models) {
    this.belongsToMany(models.User, {
      as: 'Users',
      through: models.UsersRoles,
      foreignKey: 'roleId',
      otherKey: 'userId'
    });
  };

  return Role;
};
