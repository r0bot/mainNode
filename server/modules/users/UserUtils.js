
function getPublicUser(user) {
  // TODO add validation for missing user properties.
  // Mark mandatory ones and add default values to the others.
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    country: user.country,
    city: user.city,
    postalCode: user.postalCode,
    address: user.address,
    phoneNumber: user.phoneNumber,
  };
}


module.exports = {
  getPublicUser,
};
