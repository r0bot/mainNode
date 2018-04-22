const mosca = require('mosca');
const config = require('config');
const devices = require('../modules/devices');
const logger = require('../logging/logger');

// Accepts the connection if the username and password are valid
async function authenticate(client, username, password, callback) {
  const deviceAuthenticated = await devices.verifyDeviceCredentials(username, password);
  if (deviceAuthenticated) client.deviceInfo = username;
  callback(null, deviceAuthenticated);
}

module.exports = () => {
  // fired when the mqtt server is ready
  function setup() {
    logger.info('Mosca server is up and running');
  }

  const server = new mosca.Server(config.get('mosca'));

  server.on('clientConnected', (client) => {
    console.log('client connected', client.id);
  });

  // fired when a message is received
  server.on('published', (packet, client) => {
    // console.log('Client', client);
    try {
      console.log('Published', packet.payload);
    } catch (err) {
      console.log('error parsing');
    }
  });

  server.on('ready', () => {
    server.authenticate = authenticate;
  });
};

