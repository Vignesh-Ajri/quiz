const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, authorize('admin'), createCategory);
router.patch('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;