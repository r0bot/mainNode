const logger = require('../../logging/logger');

const models = require('../../models');

const devices = models.device;

// Utility functions
function extractDeviceMetadata(deviceData) {
  return {
    deviceType: deviceData.type,
    deviceId: deviceData.id
  };
}

async function getAll() {
  let error;
  let result;
  try {
    const deviceData = await devices.findAll();
  } catch (err) {
    // TODO throw custom error
    error = err;
  }
  return { error, result };
}

async function verifyDeviceCredentials(username, password, token) {
  let error;
  const result = {
    deviceInfo: {},
    authenticated: false
  };
  try {
    const deviceFound = await devices.findOne({ where: { username } });
    if (deviceFound) {
      const deviceData = deviceFound.dataValues;
      // TODO add hashed passwords
      if (deviceData.password === password) {
        result.authenticated = true;
        result.deviceInfo = extractDeviceMetadata(deviceData);
      }else{
        throw new Error();
      }
    }
    logger.info(`Device with id ${result.deviceInfo.id} authenticated.`);
  } catch (err) {
    // TODO throw custom error
    error = err;
    logger.error('Error while updating devices in db', error);
  }
  return { error, result };
}

async function update(devicesToUpdate) {
  let error;
  let result;
  try {
    devicesToUpdate.forEach(async (device) => {
      await devices.upsert(device, { where: { id: device.id } });
    });
    logger.info(`${devicesToUpdate.length} devices data updated.`);
    result = true;
  } catch (err) {
    // TODO throw custom error
    error = err;
    logger.error('Error while updating devices in db', error);
  }
  return { error, result };
}

module.exports = {
  getAll,
  update,
  verifyDeviceCredentials
};
