module.exports = (sequelize, DataTypes) => {
  const Preparation = sequelize.define(
    'Preparation',
    {
      recipeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.Recipe,
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: sequelize.User,
          key: 'id'
        }
      },
      volumeMl: {
        type: DataTypes.DECIMAL(4, 0),
        allowNull: false
      },
      nicotineMillipercent: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      viewCount: {
        type: DataTypes.INTEGER,
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

  Preparation.associate = function(models) {
    this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Preparation;
};
