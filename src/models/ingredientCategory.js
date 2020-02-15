module.exports = (sequelize, DataTypes) => {
  const IngredientCategory = sequelize.define(
    'IngredientCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      ordinal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'ingredient_category',
      createdAt: false,
      updatedAt: false
    }
  );

  IngredientCategory.associate = function(models) {
    this.hasMany(models.Ingredient, {
      foreignKey: 'ingredientCategoryId'
    });
  };

  return IngredientCategory;
};
