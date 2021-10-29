'use strict';

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { SECRETORPRIVATEKEY } = require('../config');
const User = require('../models/user.model.db.js');

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token)
    return res.status(401).json({ msg: 'You have not sent the token' });

  try {
    const { uid } = jwt.verify(token, SECRETORPRIVATEKEY);

    // // Validate that the user with  uid  is an authenticated user.
    const authenticatedUser = await User.findById(uid);

    // Check if it exists in DB
    if (!authenticatedUser)
      return res.status(401).json({ msg: "User doesn't exist - in DB" });

    // Check if it is an active user
    if (!authenticatedUser.state)
      return res
        .status(401)
        .json({ msg: "User doesn't exist. - State: false" });

    // Create a property in req  <--  Finally Validated
    req.authenticatedUser = authenticatedUser;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Invalid token',
    });
  }
};

module.exports = { validateJWT };
