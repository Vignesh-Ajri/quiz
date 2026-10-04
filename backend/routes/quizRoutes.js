const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuestionsAdmin,
  getQuestionsForAttempt,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/quizController');
const { startAttempt } = require('../controllers/attemptController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Quiz CRUD
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/', authenticate, authorize('admin'), createQuiz);
router.patch('/:id', authenticate, authorize('admin'), updateQuiz);
router.delete('/:id', authenticate, authorize('admin'), deleteQuiz);

// Questions — two endpoints: admin (with answers) vs student (without)
router.get('/:id/questions', authenticate, authorize('admin'), getQuestionsAdmin);
router.get('/:id/questions/attempt', authenticate, getQuestionsForAttempt);
router.post('/:id/questions', authenticate, authorize('admin'), createQuestion);

// Update/delete individual questions
router.patch('/questions/:id', authenticate, authorize('admin'), updateQuestion);
router.delete('/questions/:id', authenticate, authorize('admin'), deleteQuestion);

// Start attempt
router.post('/:id/attempts', authenticate, startAttempt);

module.exports = router;
