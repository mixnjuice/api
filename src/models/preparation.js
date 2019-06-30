module.exports = (sequelize, DataTypes, models) => {
  const Preparation = sequelize.define(
    'Preparation',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      recipeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: models.Recipe,
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      created: {
        type: DataTypes.TIMESTAMP,
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
