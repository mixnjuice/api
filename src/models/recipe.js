module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      notes: {
        type: DataTypes.TEXT,
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
    this.belongsTo(models.UserProfile, {
      foreignKey: 'userId',
      sourceKey: 'userId'
    });
    this.belongsToMany(models.Flavor, {
      as: 'Flavors',
      through: models.RecipesFlavors,
      foreignKey: 'recipeId'
    });
    this.belongsToMany(models.Diluent, {
      as: 'Diluents',
      through: models.RecipesDiluents,
      foreignKey: 'recipeId'
    });
    this.hasMany(models.Preparation, {
      foreignKey: 'recipeId'
    });
  };

  return Recipe;
};
