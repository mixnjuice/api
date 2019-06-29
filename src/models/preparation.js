module.exports = (sequelize, DataTypes, models) => {
  const Preparation = sequelize.define(
    'Preparation',
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
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.User,
          key: 'id'
        }
      },
      volumeMl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nicotineMillipercent: {
        type: DataTypes.INT,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      viewCount: {
        type: DataTypes.INT,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'preparation',
      createdAt: 'created',
      updatedAt: false
    }
  );

  Preparation.associate = function() {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Preparation;
};
