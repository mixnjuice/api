module.exports = (sequelize, DataTypes, models) => {
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
          model: models.User,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created: {
        type: DataTypes.TIMESTAMP,
        allowNull: false
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      viewCount: {
        type: DataTypes.INT,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'Recipe',
      createdAt: 'created',
      updatedAt: false
    }
  );

  Recipe.associate = function() {
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Recipe;
};
