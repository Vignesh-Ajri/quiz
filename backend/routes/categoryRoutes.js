const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

// Categories management routes
router.get('/', authenticateToken, getAllCategories)

module.exports = router;