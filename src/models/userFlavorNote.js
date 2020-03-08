module.exports = (sequelize, DataTypes) => {
  const UserFlavorNote = sequelize.define(
    'UserFlavorNote',
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
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Flavor,
          key: 'id'
        }
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'user_flavor_note',
      createdAt: 'created',
      updatedAt: false
    }
  );

  UserFlavorNote.associate = function(models) {
    this.belongsTo(models.User, { foreignKey: 'UserId' });
    this.belongsTo(models.UserProfile, { foreignKey: 'userId' });
    this.hasOne(models.Flavor, { foreignKey: 'id', sourceKey: 'flavorId' });
  };

  return UserFlavorNote;
};
