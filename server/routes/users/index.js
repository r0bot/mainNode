const express = require('express');

const router = express.Router();
const Users = require('../../modules/users');

function getAllUsers(req, res) {
  /* jslint unparam: true */
  Users.getAll((error, users) => {
    if (error) {
      res.json(error);
    }
    res.json(users);
  });
}

function createUser(req, res) {
  const userData = req.body;

  const [error, result] = Users.createUser(userData);
  if (error) {
    return res.json(error);
  }
  return res.json(result);
}

/**
 * @param req
 * @param res
 */
async function getUserById({ params: { id } }, res) {
  const { error, result } = await Users.getById(id);
  if (error) {
    res.json(error);
  }
  return res.json(result);
}

// TODO add update of user
// /**
//  * @param req
//  * @param res
//  */
// function updateUser({ params: { id } }, res) {
//   users.getById(id, (error, user) => {
//     if (error) {
//       res.json(error);
//     }
//     res.json(user);
//   });
// }

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById);

module.exports = router;
