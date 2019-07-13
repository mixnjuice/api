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
        allowNull: false,
        unique: true
      },
      location: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      bio: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      url: {
        type: DataTypes.STRING,
        defaultValue: null
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
