const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllQuizzes,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/adminController');

const router = express.Router();

// Apply authentication and admin check to all routes below
router.use(authenticateToken, requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Quiz management routes
router.get('/quizzes', getAllQuizzes);
router.post('/quizzes', createQuiz);
router.get('/quizzes/:id', getQuizById);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

// Categories management routes
router.route('/categories')
  .get(getAllCategories)
  .post(createCategory);

router.route('/categories/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
