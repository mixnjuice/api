module.exports = (sequelize, DataTypes) => {
  const TagsFlavors = sequelize.define(
    'TagsFlavors',
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
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Flavor,
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

  TagsFlavors.associate = function (models) {
    this.belongsTo(models.Tag, { foreignKey: 'tagId' });
    this.belongsTo(models.User, { foreignKey: 'creatorId' });
    this.belongsTo(models.Flavor, { foreignKey: 'flavorId' });
  };

  return TagsFlavors;
};
