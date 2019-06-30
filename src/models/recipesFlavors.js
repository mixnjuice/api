module.exports = (sequelize, DataTypes, models) => {
  const RecipesFlavors = sequelize.define(
    'RecipesFlavors',
    {
      recipeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Recipe,
          key: 'id'
        }
      },
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Flavor,
          key: 'id'
        }
      },
      millipercent: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'recipes_flavors',
      createdAt: false,
      updatedAt: false
    }
  );

  RecipesFlavors.associate = function() {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.Flavor, { foreignKey: 'FlavorId' });
  };

  return RecipesFlavors;
};
