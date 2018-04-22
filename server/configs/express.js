const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const config = require('config');
const passport = require('passport');
const _ = require('lodash');

const LOGS_PATH = './storage';

module.exports = (sessionStore) => {
  // Init app variable
  const app = express();
  app.use(helmet());

  app.set('port', config.session);

  app.set('view engine', 'ejs');
  app.set('views', './server/views');
  const accessLogStream = fs.createWriteStream(`${LOGS_PATH}/access.log`, { flags: 'a' });

  // if (process.env.NODE_ENV === 'development') {
  //   app.use(morgan('dev'));
  // } else {
  //   app.use(morgan('combined', {
  //     stream: accessLogStream,
  //   }));
  // }
  app.use(morgan('combined', {
    stream: accessLogStream,
  }));
  // Setting static folder to serve
  app.use(express.static('./public'));

  app.use(favicon('./favicon.ico'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Configure session management. Extend the options with store.
  // If not provided (null/undefined) express will fallback to default MemStore.
  app.use(session(_.assign(config.get('sessions'), { store: sessionStore, resave: false, saveUninitialized: true })));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Enable logger (morgan) and set where to save the logs
  if (!fs.existsSync(LOGS_PATH)) {
    fs.mkdirSync(LOGS_PATH);
  }

  // Access-Control-Allow-Origin headers configuration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Custom-Header, Content-Type, Authorization, Content-Length, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  });

  return app;
};
