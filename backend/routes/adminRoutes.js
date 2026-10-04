const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, getQuizzes } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.get('/quizzes', getQuizzes);

module.exports = router;
