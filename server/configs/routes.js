const authController = require('./../authentication');
const routes = require('../routes/index');
const auth = require('../routes/auth');
const users = require('../routes/users');

module.exports = (app) => {
  // Basic app routes
  app.use('/auth', auth);

  // Middleware to check if user is authenticated
  app.use('/api/*', authController.isAuthenticated);
  app.use('/api/users', users);

  // Middleware to check if user is admin
  app.use('/api/admin/*', authController.isAdmin);

  app.use('*', routes);

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    /* jslint unparam: true */
    const err = new Error(`Not Found: ${req.url}`);
    err.status = 404;
    next(err);
  });
};
