module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    'Vendor',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'vendor',
      createdAt: false,
      updatedAt: false
    }
  );

  Vendor.associate = function(models) {
    this.hasMany(models.VendorIdentifier, { foreignKey: 'flavorId' });
    this.hasMany(models.Flavor, { foreignKey: 'vendorId' });
  };

  return Vendor;
};
