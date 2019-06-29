module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      activationCode: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'user',
      createdAt: 'created',
      updatedAt: false
    }
  );

  /* User.associate = function(models) {
    // associations can be defined here
  };*/
  return User;
};
