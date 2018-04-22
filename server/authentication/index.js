const userUtils = require('../modules/users/UserUtils.js');
const passport = require('passport');


// TODO check if passport is initialized here, so proper funcion is ensured.

function logout(req, res, done) {
  /* jslint unparam: true */
  req.logout();
  done(null, {
    success: true,
    user: '',
  });
}

// Return user to front end
function isLoggedIn(req, res, next) {
  /* jslint unparam: true */
  if (req.user) {
    res.json({
      success: true,
      user: req.user,
    });
  } else {
    res.json({
      success: false,
      user: '',
    });
  }
}

// Middleware function for routes, to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(403);
}

// Middleware function for routes, to check if user is admin
function isAdmin(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.indexOf('admin')) {
    return next();
  }
  return res.sendStatus(403);
}

// Local login
function login(req, res, done) {
  // Plug in the callback of authenticate without using the custom callback options.
  // This way req.logIn is handled by passport and we still intercept
  // the outcome of the authentication attempt.
  // The plug function here will receive only error as argument.
  passport.authenticate('local-login')(req, res, (error) => {
    if (error) {
      return done(new Error(`Cannot login user. Reason: ${error.message}`));
    }
    if (!req.user) {
      return done(new Error('Cannot login user. Reason: user not attached to request.'));
    }
    const resultObject = {
      user: userUtils.getPublicUser(req.user),
    };

    return done(null, resultObject);
  });
}

// Local-signup
function signup(req, res, next) {
  passport.authenticate('local-signup', (error, user, info) => {
    if (error) {
      res.status(403).send(error);
      return;
    }
    // TODO this is not supposed to return raw user data
    //  getPublicUser should happen somewhere deeper
    res.json({
      user: userUtils.getPublicUser(user),
      info,
    });
  })(req, res, next);
}

// OAuth callback
// function oauthCallback(strategy) {
//    return function (req, res, next) {
//        passport.authenticate(strategy, function (err, user) {
//            if (err || !user) {
//                res.status(403).send(err);
//                return;
//            }
//            req.logIn(user, function (error) {
//                if (error) {
//                    res.status(403).send(error);
//                    return;
//                }
//                res.redirect('/');
//            });
//        })(req, res, next);
//    };
// }

// function saveOAuthUserProfile(req, providerData) {
//    //
// }

module.exports = {
  isLoggedIn,
  isAuthenticated,
  isAdmin,
  logout,
  login,
  signup,
  // oauthCallback: oauthCallback
  // saveOAuthUserProfile: saveOAuthUserProfile
};
