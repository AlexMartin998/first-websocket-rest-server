'use strict';

const { response, request } = require('express');

const isAdmin = (req = request, res = response, next) => {
  if (!req.authenticatedUser)
    return res.status(500).json({
      msg: "It is not possible to validate the user's role without a valid token.",
    });

  const { role, name } = req.authenticatedUser;

  if (role !== 'ADMIN_ROLE')
    return res
      .status(402)
      .json({ msg: `${name} is not an admin. - He can't do it.` });

  next();
};

const hasUserRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.authenticatedUser)
      return res.status(500).json({
        msg: "It is not possible to validate the user's role without a valid token.",
      });
    // console.log(roles, req.authenticatedUser.role);

    if (!roles.includes(req.authenticatedUser.role))
      return res.status(401).json({
        msg: `User without valid role!`,
      });

    next();
  };
};

module.exports = {
  isAdmin,
  hasUserRole,
};
