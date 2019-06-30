module.exports = (sequelize, DataTypes) => {
  const RecipesDiluents = sequelize.define(
    'RecipesDiluents',
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
      diluentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Diluent,
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

  RecipesDiluents.associate = function(models) {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.Diluent, { foreignKey: 'diluentId' });
  };

  return RecipesDiluents;
};
