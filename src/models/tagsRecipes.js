module.exports = (sequelize, DataTypes) => {
  const TagsRecipes = sequelize.define(
    'TagsRecipes',
    {
      tagId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Tag,
          key: 'id'
        }
      },
      recipeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Recipe,
          key: 'id'
        }
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
      tableName: 'tags_flavors',
      createdAt: 'created',
      updatedAt: false
    }
  );

  TagsRecipes.associate = function(models) {
    this.belongsTo(models.Tag, { foreignKey: 'tagId' });
    this.belongsTo(models.User, { foreignKey: 'creatorId' });
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
  };

  return TagsRecipes;
};
