'use strict';

const { request, response } = require('express');
const Product = require('./../models/product.model.db.js');

const createProduct = async (req = request, res = response) => {
  const { name, category } = req.body;

  // const alreadyExist = await Product.findOne({ name });

  // if (alreadyExist)
  //   return res.status(400).json({ msg: `Product: ${name} alreade exist` });

  const data = {
    name: name.toLowerCase(),
    user: req.authenticatedUser._id,
    category,
  };

  const product = await new Product(data);

  await product.save();

  res.status(201).json({ msg: 'New Product registered', product });
};

const getProducts = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const activeProducts = { state: true };

  const [products, total] = await Promise.all([
    Product.find(activeProducts)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(+from)
      .limit(+limit),
    Product.countDocuments(activeProducts),
  ]);

  res.status(200).json({
    msg: 'Get all products',
    total,
    products,
  });
};

const getAProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.status(200).json({ msg: 'A product', product });
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  let { name, newName, category } = req.body;

  name = newName.toLowerCase();
  const [, renamed] = await Promise.all([
    await Product.findByIdAndUpdate(id, { name }),
    await Product.findById(id),
  ]);

  res.json({
    msg: 'Update - PUT | Product updated!',
    categoryID: id,
    renamed,
  });
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const productDeleted = await Product.findByIdAndUpdate(id, {
    state: false,
  });

  res.json({
    msg: 'Delete - Delete | Product deleted!',
    productDeleted,
  });
};

module.exports = {
  createProduct,
  getProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
};
