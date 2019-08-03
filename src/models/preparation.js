module.exports = (sequelize, DataTypes) => {
  const Preparation = sequelize.define(
    'Preparation',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      recipeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: sequelize.Recipe,
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: sequelize.UserProfile,
          key: 'id'
        }
      },
      volumeMl: {
        type: DataTypes.DECIMAL(4, 0),
        allowNull: false
      },
      nicotineMillipercent: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'preparation',
      createdAt: 'created',
      updatedAt: false
    }
  );

  Preparation.associate = function(models) {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.UserProfile, {
      foreignKey: 'userId',
      sourceKey: 'userId'
    });
    this.belongsToMany(models.Diluent, {
      as: 'Diluents',
      through: models.PreparationsDiluents,
      foreignKey: 'preparationId'
    });
  };

  return Preparation;
};
