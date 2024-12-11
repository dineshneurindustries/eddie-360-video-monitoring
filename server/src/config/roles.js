const allRoles = {
  user: ['manageSessions'],
  admin: ['getUsers', 'manageUsers', 'getModules', 'manageModules', 'manageAssessment', 'manageSessions', 'getSessions'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
