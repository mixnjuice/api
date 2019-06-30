module.exports = (sequelize, DataTypes) => {
  const DataSupplier = sequelize.define(
    'DataSupplier',
    {
      id: {
        type: DataTypes.INT,
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

  /* DataSupplier.associate = function(models) {
    // associations can be defined here
  };*/
  return DataSupplier;
};
