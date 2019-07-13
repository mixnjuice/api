module.exports = (sequelize, DataTypes) => {
  const PreparationsDiluents = sequelize.define(
    'PreparationsDiluents',
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
      },
      nicotineConcentration: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
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

  PreparationsDiluents.associate = function(models) {
    this.belongsTo(models.Preparation, { foreignKey: 'preparationId' });
    this.belongsTo(models.Diluent, { foreignKey: 'diluentId' });
  };

  return PreparationsDiluents;
};
