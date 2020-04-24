module.exports = (sequelize, DataTypes) => {
  const FlavorsIngredients = sequelize.define(
    'FlavorsIngredients',
    {
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Flavor,
          key: 'id'
        }
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Ingredient,
          key: 'id'
        }
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'flavors_ingredients',
      createdAt: 'created',
      updatedAt: 'updated'
    }
  );

  FlavorsIngredients.associate = function (models) {
    this.belongsTo(models.Ingredient, {
      foreignKey: 'ingredientId'
    });
    this.belongsTo(models.Flavor, {
      foreignKey: 'flavorId'
    });
  };

  return FlavorsIngredients;
};
