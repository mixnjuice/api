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
      version: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      parentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: sequelize.Recipe,
          key: 'id'
        }
      },
      adaptedId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: sequelize.Recipe,
          key: 'id'
        }
      },
      creatorId: {
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
    this.hasOne(models.Recipe, { as: 'Parent', foreignKey: 'parentId' });
    this.hasOne(models.Recipe, { as: 'AdaptedFrom', foreignKey: 'adaptedId' });
    this.belongsTo(models.User, { foreignKey: 'creatorId' });
    this.belongsTo(models.UserProfile, {
      foreignKey: 'creatorId',
      sourceKey: 'userId'
    });
    this.belongsToMany(models.Flavor, {
      as: 'Flavors',
      through: models.RecipesFlavors,
      foreignKey: 'recipeId',
      otherKey: 'flavorId'
    });
    this.belongsToMany(models.Diluent, {
      as: 'Diluents',
      through: models.RecipesDiluents,
      foreignKey: 'recipeId',
      otherKey: 'diluentId'
    });
    this.hasMany(models.Preparation, {
      foreignKey: 'recipeId'
    });
  };

  return Recipe;
};
