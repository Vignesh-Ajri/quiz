const express =require('express');
const { authenticateToken } =require('../middleware/authMiddleware.js');
const { getUserDashboard } =require('../controllers/userController.js');

const router = express.Router();

router.get('/dashboard', authenticateToken, getUserDashboard);

module.exports = router;
