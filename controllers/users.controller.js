'use strict';

const { response, request } = require('express');
const User = require('../models/user.model.db.js');
const bcryptjs = require('bcryptjs');

const getUsers = async (req = request, res = response) => {
  // Basic pagination
  const { from = 0, limit = 5 } = req.query;
  const activeUsers = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(activeUsers),
    User.find(activeUsers)
      .skip(+from)
      .limit(+limit),
  ]);

  res.json({
    msg: 'Read - GET  |  Controller',
    total,
    users,
  });
};

const postUser = async (req, res = response) => {
  const { name, mail, password, role } = req.body;
  const user = new User({ name, mail, password, role });

  // Encrypt
  const salt = bcryptjs.genSaltSync(); // complejidad del hash, 10 x default
  user.password = bcryptjs.hashSync(password, salt);

  // Save in DB
  await user.save();

  return res.status(201).json({
    msg: 'Create - POST  |  Controller',
    user,
  });
};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    _id,
    password: newPassword,
    google,
    mail,
    role,
    ...restData
  } = req.body;

  if (newPassword) {
    const salt = bcryptjs.genSaltSync();
    restData.password = bcryptjs.hashSync(newPassword, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, restData);

  res.json(updatedUser);
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  // // 1. Physically delete  -  Not recommended
  // const userDeleted = await User.findByIdAndDelete(id);
  // // 2. Change user state in DB
  const userDeleted = await User.findByIdAndUpdate(id, { state: false });

  res.json({
    msg: 'Delete - DELETE  |  Controller',
    userDeleted,
  });
};

module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
};
