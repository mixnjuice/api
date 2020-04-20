module.exports = (sequelize, DataTypes) => {
  const DataSupplier = sequelize.define(
    'DataSupplier',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      tableName: 'data_supplier',
      createdAt: false,
      updatedAt: false
    }
  );

  DataSupplier.associate = function (models) {
    this.hasMany(models.FlavorIdentifier, {
      foreignKey: 'dataSupplierId'
    });
    this.hasMany(models.VendorIdentifier, {
      foreignKey: 'dataSupplierId'
    });
  };
  return DataSupplier;
};
