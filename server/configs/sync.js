const Sync = require('../modules/sync');

const devices = require('../modules/devices')

const serverSync = new Sync();

serverSync.syncDevices();
devices.getAll();

