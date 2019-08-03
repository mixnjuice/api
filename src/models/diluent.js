module.exports = (sequelize, DataTypes) => {
  const Diluent = sequelize.define(
    'Diluent',
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
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      density: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'diluent',
      createdAt: false,
      updatedAt: false
    }
  );

  Diluent.associate = function(models) {
    this.belongsToMany(models.Recipe, {
      as: 'Recipes',
      through: models.RecipesDiluents,
      foreignKey: 'diluentId',
      otherKey: 'recipeId'
    });
  };
  return Diluent;
};
