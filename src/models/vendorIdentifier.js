module.exports = (sequelize, DataTypes) => {
  const VendorIdentifier = sequelize.define(
    'VendorIdentifier',
    {
      vendorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: sequelize.Vendor,
          key: 'id'
        }
      },
      dataSupplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
      tableName: 'vendor_identifier',
      createdAt: false,
      updatedAt: false
    }
  );

  VendorIdentifier.associate = function(models) {
    this.belongsTo(models.Vendor, { foreignKey: 'vendorId' });
    this.belongsTo(models.DataSupplier, { foreignKey: 'dataSupplierId' });
  };

  return VendorIdentifier;
};
