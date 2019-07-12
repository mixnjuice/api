module.exports = (sequelize, DataTypes) => {
  const DataSupplier = sequelize.define(
    'DataSupplier',
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
      code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'data_supplier',
      createdAt: false,
      updatedAt: false
    }
  );

  DataSupplier.associate = function(models) {
    this.hasMany(models.FlavorIdentifier, {
      foreignKey: 'dataSupplierId'
    });
    this.hasMany(models.VendorIdentifier, {
      foreignKey: 'dataSupplierId'
    });
  };
  return DataSupplier;
};
