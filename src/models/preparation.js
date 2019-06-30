module.exports = (sequelize, DataTypes) => {
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
          model: sequelize.Recipe,
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: sequelize.User,
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
