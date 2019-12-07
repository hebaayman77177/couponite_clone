const Category = require("../models/category");
const { idExist } = require("../validationSchemas");

async function createCategory(req, res, next) {
  const category = await Category.create(req.body);
  return res.status(200).json({
    data: category
  });
}

async function getCategories(req, res, next) {
  const categories = await Category.find();
  return res.status(200).json({
    length: categories.length,
    data: categories
  });
}

async function getCategory(req, res, next) {
  const category = await Category.findById(req.params.id);
  return res.status(200).json({
    data: category
  });
}

async function updateCategory(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Category);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    data: category
  });
}

async function deleteCategory(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Category);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const category = await Category.findByIdAndDelete(id);
  return res.status(200).json({
    data: category
  });
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
