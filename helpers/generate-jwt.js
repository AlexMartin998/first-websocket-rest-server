'use strict';

const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = require('../config');
const User = require('./../models/user.model.db.js');

const generateJST = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, SECRETORPRIVATEKEY, { expiresIn: '4h' }, (err, token) => {
      if (err) {
        console.log(err);
        reject('Sorry, the JWT could not be generated');
      } else resolve(token);
    });
  });
};

const checkToken = async (token = '') => {
  try {
    if (token.length <= 10) return null;

    const { uid } = jwt.verify(token, SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    if (!user || !user.state) return null;

    return user;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateJST,
  checkToken,
};
