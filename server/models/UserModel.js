const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('user', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    username: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
  });
};
