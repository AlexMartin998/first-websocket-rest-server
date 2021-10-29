'use strict';

const { request, response } = require('express');
const Category = require('../models/category.model.db');

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryExist = await Category.findOne({ name });

  if (categoryExist)
    return res.status(400).json({
      msg: `Category ${name} already exists in DB`,
    });

  const data = {
    name,
    user: req.authenticatedUser._id,
  };

  const category = await new Category(data);

  await category.save();

  res.status(201).json({
    msg: 'Create - POST | Category Created!',
    category,
  });
};

// Pagination - total - .populate()
const showCategories = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const activeCategories = { state: true };

  const [allCategories, total] = await Promise.all([
    Category.find(activeCategories)
      .populate('user', 'name')
      .skip(+from)
      .limit(+limit),
    Category.countDocuments(activeCategories),
  ]);

  res.json({
    msg: 'Read - GET | Categories',
    total,
    allCategories,
  });
};

// populate <- retur category object
const getACategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('user', 'name');

  if (!category.state)
    return res
      .status(401)
      .json({ msg: `The ID ${id} doesn't exist - state false!` });

  res.json({
    msg: 'Read - GET | Category',
    category,
  });
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  let { name, newName } = req.body;

  const category = await Category.findById(id);

  if (newName.toUpperCase() === category.name)
    return res.status(400).json({ msg: 'New name must not be the same' });

  name = newName.toUpperCase();
  const [, renamed] = await Promise.all([
    await Category.findByIdAndUpdate(id, { name }),
    await Category.findById(id),
  ]);

  res.json({
    msg: 'Update - PUT | Category updated!',
    categoryID: id,
    renamed,
  });
};

// state: false  <-  admin
const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const categoryDeleted = await Category.findByIdAndUpdate(id, {
    state: false,
  });

  res.json({
    msg: 'Delete - Delete | Category deleted!',
    categoryDeleted,
  });
};

module.exports = {
  createCategory,
  showCategories,
  getACategory,
  updateCategory,
  deleteCategory,
};
