const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getAllQuizzes,
  getQuizById,
  attemptQuiz,
  submitAttempt,
  getAttemptById
} = require('../controllers/quizController');

const router = express.Router();

// Apply authentication and admin check to all routes below
router.use(authenticateToken);

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/attempt', attemptQuiz);
router.post('/attempts/:id/submit', submitAttempt);
router.get('/attempts/:id', getAttemptById);

module.exports = router;
