'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdmin } = require('../middlewares');
const {
  getProducts,
  getAProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');
const {
  productIdExist,
  categoryIdExist,
  isProductActive,
  productExist,
  alreadyExist,
} = require('./../helpers/db-validators.js');

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(alreadyExist),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'It is not a valid Mongo ID').isMongoId(),
    check('category').custom(categoryIdExist),
    validateFields,
  ],
  createProduct
);

router.get('/', getProducts);

router.get(
  '/:id',
  [
    check('id', "It's not a valid ID").isMongoId(),
    check('id').custom(productIdExist),
    check('id').custom(isProductActive),
    validateFields,
  ],
  getAProduct
);

router.put(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(productExist),
    check('id', "It's not a valid ID").isMongoId(),
    check('id').custom(productIdExist),
    check('id').custom(isProductActive),
    // check('category', 'Category is required').not().isEmpty(),
    // check('category', 'It is not a valid Mongo ID').isMongoId(),
    // check('category').custom(categoryIdExist),

    validateFields,
  ],
  updateProduct
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdmin,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productIdExist),
    check('id').custom(isProductActive),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
