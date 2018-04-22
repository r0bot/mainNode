const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const userUtils = require('./UserUtils');

const models = require('../../models');

const users = models.User;

const userValidationSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30)
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  provider: Joi.string().valid(['local']).required(),
  email: Joi.string().email().required()
});

async function getAll() {
  let error;
  let result;
  try {
    const usersData = await users.getAll();
    result = usersData.map(user => userUtils.getPublicUser(user));
  } catch (err) {
    // TODO throw custom error
    error = err;
  }
  return { error, result };
}

async function getById(userId) {
  let error;
  let result;
  try {
    const usersData = await users.findOne({ where: { id: userId } });
    result = usersData.get({
      plain: true
    });
  } catch (err) {
    // TODO throw custom error
    error = err;
  }
  return { error, result };
}

async function getByUsername(username) {
  let error;
  let result;
  try {
    const userData = await users.findOne({ where: { username } });
    result = userData ? userUtils.getPublicUser(userData) : null;
  } catch (err) {
    // TODO throw custom error
    error = err;
  }
  return { error, result };
}

async function createUser(userData) {
  let error;
  let result;

  const validationResult = Joi.validate(userData, userValidationSchema, { stripUnknown: true });
  if (validationResult.error) {
    return { error: validationResult.error, result: null };
  }
  try {
    const validatedUser = validationResult.value;
    const hashedPassword = await bcrypt.hash(validatedUser.password, config.get('bcrypt.saltRounds'));
    // Overwrite the password with the hashed one
    validatedUser.password = hashedPassword;
    const createdUser = await users.create(validationResult.value);
    result = userUtils.getPublicUser(createdUser.dataValues);
  } catch (err) {
    // TODO throw custom error
    error = err;
  }

  return { error, result };
}

// TODO this function is a raw version of what it should be
// write it with proper checks and validations
async function validateUserPassword(username, password) {
  let error;
  let result;
  try {
    const userData = await users.findOne({ where: { username } });
    if (userData === null) {
      error = new Error('Username does not exist.');
      return { error };
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      error = new Error('Wrong password.');
      return { error };
    }
    // TODO this exposes whole user to log fix it
    result = userData.dataValues;
  } catch (err) {
    // TODO throw custom error
    error = err;
  }
  return { error, result };
}

module.exports = {
  getAll,
  getById,
  getByUsername,
  createUser,
  validateUserPassword,
};
