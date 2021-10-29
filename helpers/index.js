const dbValidators = require('./db-validators.js');
const generateJWT = require('./generate-jwt.js');
const googleVerify = require('./google-verify.js');
const uploadFile = require('./upload-file.js');

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile,
};
