module.exports = (sequelize, DataTypes, models) => {
  const Flavor = sequelize.define(
    'Flavor',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      vendorId: {
        type: DataTypes.INT,
        allowNull: false,
        references: {
          model: models.Vendor,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      density: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'flavor',
      createdAt: false,
      updatedAt: false
    }
  );

  Flavor.associate = function() {
    this.belongsTo(models.Vendor, { foreignKey: 'vendorId' });
  };

  return Flavor;
};
