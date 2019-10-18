module.exports = (sequelize, DataTypes) => {
  const RecipesFlavors = sequelize.define(
    'RecipesFlavors',
    {
      recipeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Recipe,
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

  RecipesFlavors.associate = function(models) {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.Flavor, { foreignKey: 'flavorId' });
  };

  return RecipesFlavors;
};
