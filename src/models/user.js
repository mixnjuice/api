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

  User.associate = function(models) {
    this.hasMany(models.Recipe, {
      foreignKey: 'userId'
    });
    this.hasMany(models.Preparation, {
      foreignKey: 'userId'
    });
    this.hasMany(models.UsersFlavors, {
      foreignKey: 'userId'
    });
    this.hasMany(models.UsersRoles, {
      foreignKey: 'userId'
    });
    this.hasOne(models.UserProfile, {
      foreignKey: 'userId'
    });
    this.hasOne(models.UserToken, {
      foreignKey: 'userId'
    });
  };

  return User;
};
