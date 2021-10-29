'use strict';

const router = require('express').Router();
const { check } = require('express-validator');

const { validateFields, validateFile } = require('../middlewares');

const {
  uploadFileController,
  updateImg,
  serveImg,
  updateImgCloudinary,
} = require('../controllers/uploads.controller');
const { allowedCollections, productIdExist } = require('../helpers');

router.post('/', [validateFile, validateFields], uploadFileController);

router.get(
  '/:collection/:id',
  [
    check('collection').custom(c =>
      allowedCollections(c, ['users', 'products'])
    ),
    check('id', 'It is not a valid Mongo ID!').isMongoId(),
    check('id').custom(productIdExist),
    validateFields,
  ],
  serveImg
);

router.put(
  '/:collection/:id',
  [
    validateFile,
    check('id', 'It is not a valid Mongo ID').isMongoId(),
    check('collection').custom(c =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
  ],
  // updateImg  // Upload images to our own server
  updateImgCloudinary
);

module.exports = router;
