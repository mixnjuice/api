module.exports = (sequelize, DataTypes) => {
  const Diluent = sequelize.define(
    'Diluent',
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
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      density: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'diluent',
      createdAt: false,
      updatedAt: false
    }
  );

  /* Diluent.associate = function(models) {
    // associations can be defined here
  };*/
  return Diluent;
};
