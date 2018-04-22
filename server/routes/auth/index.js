const express = require('express');

const router = express.Router();
const authentication = require('./../../authentication');

function login(req, res) {
  authentication.login(req, res, (error, user) => {
    if (error) {
      res.status(403).send(error);
      return;
    }
    res.json(user);
  });
}

function logout(req, res) {
  authentication.logout(req, res, (error, result) => {
    if (error) {
      res.status(403).send(error);
      return;
    }
    res.json(result);
  });
}

// Route to check if user is logged in
router.get('/', authentication.isLoggedIn);
// logout route
router.post('/login', login);
// logout route
router.get('/logout', logout);
// register route
router.post('/register', authentication.signup);

module.exports = router;
