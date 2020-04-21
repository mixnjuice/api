module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    'Ingredient',
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
      casNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      ingredientCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.IngredientCategory,
          key: 'id'
        }
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'ingredient',
      createdAt: 'created',
      updatedAt: 'updated'
    }
  );

  Ingredient.associate = function (models) {
    this.hasOne(models.IngredientCategory, {
      foreignKey: 'ingredientCategoryId'
    });
  };

  return Ingredient;
};
