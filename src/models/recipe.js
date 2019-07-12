module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: sequelize.User,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'recipe',
      createdAt: 'created',
      updatedAt: false
    }
  );

  Recipe.associate = function(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.hasMany(models.RecipesFlavors, {
      foreignKey: 'recipeId'
    });
    this.hasMany(models.RecipesDiluents, {
      foreignKey: 'recipeId'
    });
    this.hasMany(models.Preparation, {
      foreignKey: 'recipeId'
    });
  };

  return Recipe;
};
