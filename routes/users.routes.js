'use strict';
const router = require('express').Router();
const { check } = require('express-validator');

const {
  validateFields,
  validateJWT,
  isAdmin,
  hasUserRole,
} = require('./../middlewares');

const {
  isValidRole,
  isAlreadyRegistered,
  userIdExist,
} = require('../helpers/db-validators.js');
const {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller.js');

router.post(
  '/',
  [
    check('name', 'Name is required.').not().isEmpty(),
    check(
      'password',
      'The password must be longer than 6 characters.'
    ).isLength({ min: 6 }),
    check('mail', 'The email is not valid.').isEmail(),
    check('mail').custom(isAlreadyRegistered),
    // check('role', 'The role is not valid.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields,
  ],
  postUser
);

router.get('/', getUsers);

router.put(
  '/:id',
  [
    check('id', 'ID is not valid mongoID').isMongoId(),
    check('id').custom(userIdExist),
    validateFields,
  ],
  updateUser
);

router.delete(
  '/:id',
  [
    validateJWT,
    // isAdmin,
    hasUserRole('ADMIN_ROLE', 'ANY_OTHER_ROLE'),
    check('id', 'ID is not valid mongoID').isMongoId(),
    check('id').custom(userIdExist),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
