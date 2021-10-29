'use strict';

const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },

  mail: {
    type: String,
    required: [true, 'E-mail is required!'],
    unique: true, // q no hayan 2plicados. Tambien validar a condigo
  },

  password: {
    type: String,
    required: [true, 'Password is required!'],
  },

  img: {
    type: String,
  },

  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    emun: ['ADMIN_ROLE', 'USER_ROLE'],
  },

  state: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...dataUser } = this.toObject();
  dataUser.uid = _id;
  return dataUser;
};

module.exports = model('User', UserSchema);
