module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
    this.hasOne(models.UserProfile, {
      foreignKey: 'userId'
    });
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
    this.hasMany(models.UserToken, {
      foreignKey: 'userId'
    });
  };

  return User;
};
