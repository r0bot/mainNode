
const uuid = require('uuid');
const ERRORS = {
  wrong_device_password: {
    responseCode: 400,
    description: 'Provided credentials does not match a record in the database.'
  }
};


class Errors {
  getErrorByName(errorName) {
    const errorID = uuid.v4();
    const errorData = ERRORS[errorName];
    if (errorData) {
      return new Error(`errorData.description. Error ID: ${errorID}`);
    }
    return new Error(`A server error occurred, please provide this ID : ${errorID}`);
  }
}
