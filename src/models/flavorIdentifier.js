module.exports = (sequelize, DataTypes, models) => {
  const FlavorIdentifier = sequelize.define(
    'FlavorIdentifier',
    {
      flavorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Flavor,
          key: 'id'
        }
      },
      dataSupplierId: {
        type: DataTypes.INT,
        allowNull: false,
        references: {
          model: models.DataSupplier,
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

  FlavorIdentifier.associate = function() {
    this.belongsTo(models.Flavor, { foreignKey: 'flavorId' });
    this.belongsTo(models.DataSupplier, { foreignKey: 'dataSupplierId' });
  };

  return FlavorIdentifier;
};
