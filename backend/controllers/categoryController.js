const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/v1/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isPublished: true })
      .populate('parentId', 'name slug')
      .sort({ name: 1 });
    return sendSuccess(res, { categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/categories/:id
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentId', 'name slug');
    if (!category) return sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return sendSuccess(res, { category });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/categories  [ADMIN]
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, parentId } = req.body;
    if (!name) return sendError(res, 'Category name is required', 400, 'VALIDATION_ERROR');

    const category = await Category.create({ name, description, icon, parentId: parentId || null });
    return sendSuccess(res, { category }, 'Category created', 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/categories/:id  [ADMIN]
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, parentId, isPublished } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, parentId, isPublished },
      { new: true, runValidators: true }
    );
    if (!category) return sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return sendSuccess(res, { category }, 'Category updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/categories/:id  [ADMIN]
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404, 'NOT_FOUND');
    return sendSuccess(res, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };