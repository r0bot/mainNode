const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize) => {
  const Device = sequelize.define('device', {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue() {
        return uuidv4();
      },
      primaryKey: true
    },
    type: {
      type: Sequelize.DataTypes.STRING
    },
    username: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    token: Sequelize.DataTypes.STRING
  });
  Device.sync();
  return Device;
};
