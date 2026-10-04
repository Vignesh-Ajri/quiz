const express = require('express');
const router = express.Router();
const { saveAnswer, submitAttempt, getAttempt } = require('../controllers/attemptController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/:id', authenticate, getAttempt);
router.patch('/:id/answer', authenticate, saveAnswer);
router.post('/:id/submit', authenticate, submitAttempt);

module.exports = router;
