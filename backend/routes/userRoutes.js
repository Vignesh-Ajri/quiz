const express = require('express');
const router = express.Router();
const { getMyAttempts, getMyStats, getLeaderboard } = require('../controllers/attemptController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/me/attempts', authenticate, getMyAttempts);
router.get('/me/stats', authenticate, getMyStats);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
