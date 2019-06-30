module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INT,
        allowNull: false,
        primaryKey: true
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

  Role.associate = function() {
    //
  };

  return Role;
};
