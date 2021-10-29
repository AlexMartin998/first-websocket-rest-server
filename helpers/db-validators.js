'use strict';

const User = require('../models/user.model.db.js');
const Role = require('../models/role.model.db.js');
const Category = require('../models/category.model.db.js');
const Product = require('../models/product.model.db.js');

const isAlreadyRegistered = async (mail = '') => {
  const emailExist = await User.findOne({ mail });
  if (emailExist) throw new Error(`Email ${mail} is already registered.`);
};

const isValidRole = async (role = '') => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`The role: ${role} is not valid in this app.`);
};

const userIdExist = async id => {
  const userIDExist = await User.findById(id);
  if (!userIDExist) throw new Error(`User ID: ${id} does not exist`);
};

const categoryIdExist = async id => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) throw new Error(`Category ID: ${id} does not exist!`);
};

const categoryExist = async (name = '') => {
  const categoryExist = await Category.findOne({ name: name.toUpperCase() });
  if (!categoryExist) throw new Error(`Category ${name} does not exist!!!`);
};

const isCategoryActive = async (id = '') => {
  const category = await Category.findById(id);
  if (!category.state)
    throw new Error(`The ID ${id} doesn't exist - state false!`);
};

const productIdExist = async id => {
  const productExist = await Product.findById(id);
  if (!productExist) throw new Error(`Product ID: ${id} does not exist!`);
};

const productExist = async (name = '') => {
  const productExist = await Product.findOne({
    name: name.toLocaleLowerCase(),
  });
  if (!productExist) throw new Error(`Product ${name} does not exist!!!`);
};

const isProductActive = async (id = '') => {
  const product = await Product.findById(id);
  if (!product.state)
    throw new Error(`The ID ${id} doesn't exist - state false!`);
};

const alreadyExist = async (name = '') => {
  const nameExist = await Product.findOne({ name: name.toLocaleLowerCase() });
  if (nameExist) throw new Error(`Ename ${name} is already registered.`);
};

// allowed collections
const allowedCollections = (collection = '', collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded) throw new Error(`Collection ${collection} is not allowed!`);

  return true;
};

module.exports = {
  isValidRole,
  isAlreadyRegistered,
  userIdExist,
  categoryIdExist,
  categoryExist,
  isCategoryActive,

  productIdExist,
  productExist,
  isProductActive,
  alreadyExist,

  allowedCollections,
};
