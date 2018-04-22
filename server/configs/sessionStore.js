const config = require('config');
const Sequelize = require('sequelize');
const session = require('express-session');
// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = function () {
  // create database, ensure 'sqlite3' in your package.json
  const sequelize = new Sequelize('sessions', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // SQLite only
    storage: './storage/sessions.sqlite',
  });

  const sessionStore = new SequelizeStore({
    db: sequelize
  });

  sessionStore.sync();

  return sessionStore;
};
