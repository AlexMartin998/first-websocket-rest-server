'use strict';

const router = require('express').Router();
const { searchQuery } = require('../controllers/search.controller');

router.get('/:collection/:query', searchQuery);

module.exports = router;
