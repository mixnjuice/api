module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    'Vendor',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
