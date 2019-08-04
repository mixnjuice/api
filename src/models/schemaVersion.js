module.exports = (sequelize, DataTypes) => {
  const SchemaVersion = sequelize.define(
    'SchemaVersion',
    {
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      md5: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      runAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'schemaversion',
      createdAt: false,
      updatedAt: false
    }
  );

  /* SchemaVersion.associate = function(models) {}; */
  return SchemaVersion;
};
