'use strict';

const User = require('../models/user.model.db');

const emailExist = async (mail = '') => {
  const emailExist = await User.findOne({ mail });
  if (!emailExist) throw new Error(`Email ${mail} is not registered.`);
};

module.exports = {
  emailExist,
};
