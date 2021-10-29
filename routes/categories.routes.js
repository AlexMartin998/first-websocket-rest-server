'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdmin } = require('../middlewares');

const {
  showCategories,
  getACategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories.controller');
const {
  categoryIdExist,
  categoryExist,
  isCategoryActive,
} = require('../helpers/db-validators');

// Create a new category - private for any valid role
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required!').not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Get all categories - public
router.get('/', showCategories);

// Get a category by ID - public  - Middleware personlizado id exist?
router.get(
  '/:id',
  [
    check('id', 'Invalid ID!').isMongoId(),
    check('id').custom(categoryIdExist),
    validateFields,
  ],
  getACategory
);

// Update a category by ID - private for any valid role
router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'Name is required!').not().isEmpty(),
    check('name').custom(categoryExist),
    check('id', 'Invalid ID!').isMongoId(),
    check('id').custom(categoryIdExist),
    check('id').custom(isCategoryActive),
    validateFields,
  ],
  updateCategory
);

// Delete a category - private only for Admin  <--  state: false
router.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryIdExist),
    check('id').custom(isCategoryActive),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
