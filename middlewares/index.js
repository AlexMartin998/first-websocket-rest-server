const validateFields = require('../middlewares/validate-fields.middleware.js');
const validateJWT = require('../middlewares/validate-jwt.middleware.js');
const validateRoles = require('../middlewares/validate-role.middleware.js');
const validateFiles = require('./validate-file.middleware.js');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
  ...validateFiles,
};
