export default (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    'UserToken',
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'user_token',
      createdAt: 'created',
      updatedAt: false
    }
  );

  return UserToken;
};
