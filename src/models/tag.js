module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      creatorId: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'tag',
      createdAt: 'created',
      updatedAt: false
    }
  );

  Tag.associate = function(models) {
    this.hasOne(models.User, {
      foreignKey: 'id',
      sourceKey: 'creatorId'
    });
    this.belongsToMany(models.Flavor, {
      as: 'Flavors',
      through: models.TagsFlavors,
      foreignKey: 'tagId',
      otherKey: 'flavorId'
    });
    this.belongsToMany(models.Recipe, {
      as: 'Recipes',
      through: models.TagsRecipes,
      foreignKey: 'tagId',
      otherKey: 'recipeId'
    });
  };

  return Tag;
};
