const config = require('config');
const uuidv4 = require('uuid/v4');

const devices = require('../devices');

class Sync {
  constructor() {
    this.heartbeatInterval = config.get('sync.heartbeatInterval');
    this.lastUpdate = Date.now();
  }

  async getRegisteredDevices(lastUpdated) {
    return [{
      id: uuidv4(),
      type: 'switch',
      username: 'device1',
      password: 'device1',
      token: ''
    },
    {
      id: '81dfff67-8262-458e-bf34-1cf81b6feeb2',
      type: 'switch',
      username: 'device2',
      password: 'device2',
      token: ''
    }];
  }

  async syncDevices() {
    const devicesFromServer = await this.getRegisteredDevices();
    await devices.update(devicesFromServer);
    return true;
  }
}

module.exports = Sync;
