module.exports = (sequelize, DataTypes, models) => {
  const RecipesDiluents = sequelize.define(
    'RecipesDiluents',
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
      diluentId: {
        type: DataTypes.INT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Diluent,
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
      tableName: 'recipes_diluents',
      createdAt: false,
      updatedAt: false
    }
  );

  RecipesDiluents.associate = function() {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.Diluent, { foreignKey: 'diluentId' });
  };

  return RecipesDiluents;
};
