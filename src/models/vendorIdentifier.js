module.exports = (sequelize, DataTypes, models) => {
  const VendorIdentifier = sequelize.define(
    'VendorIdentifier',
    {
      vendorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: models.Vendor,
          key: 'id'
        }
      },
      dataSupplierId: {
        type: DataTypes.INT,
        allowNull: false,
        primaryKey: true,
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
      tableName: 'vendor_identifier',
      createdAt: false,
      updatedAt: false
    }
  );

  VendorIdentifier.associate = function() {
    this.belongsTo(models.Vendor, { foreignKey: 'vendorId' });
    this.belongsTo(models.DataSupplier, { foreignKey: 'dataSupplierId' });
  };

  return VendorIdentifier;
};
