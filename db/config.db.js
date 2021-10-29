'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB online');
  } catch (err) {
    console.log(err);
    throw new Error('Error from inicialized db');
  }
};

module.exports = {
  dbConnection,
};
