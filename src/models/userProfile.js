module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    'UserProfile',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'user_profile',
      createdAt: false,
      updatedAt: false
    }
  );

  UserProfile.associate = function(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return UserProfile;
};
