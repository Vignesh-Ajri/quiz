const QuizAttempt = require('../models/QuizAttempt');

const getUserDashboard = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ 
      userId: req.user._id, 
      status: 'completed' 
    })
      .populate('quizId', 'title category')
      .sort('-createdAt')
      .limit(10);

    const stats = await QuizAttempt.aggregate([
      { $match: { userId: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' }
        }
      }
    ]);

    res.json({
      recentAttempts: attempts,
      stats: stats[0] || { totalAttempts: 0, averageScore: 0, bestScore: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getUserDashboard
}