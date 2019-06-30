module.exports = (sequelize, DataTypes) => {
  const FlavorIdentifier = sequelize.define(
    'FlavorIdentifier',
    {
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Flavor,
          key: 'id'
        }
      },
      dataSupplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.DataSupplier,
          key: 'id'
        }
      },
      identifier: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'flavor_identifier',
      createdAt: false,
      updatedAt: false
    }
  );

  FlavorIdentifier.associate = function(models) {
    this.belongsTo(models.Flavor, { foreignKey: 'flavorId' });
    this.belongsTo(models.DataSupplier, { foreignKey: 'dataSupplierId' });
  };

  return FlavorIdentifier;
};
