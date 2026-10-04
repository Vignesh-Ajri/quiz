const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const Attempt = require('../models/QuizAttempt');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// GET /api/v1/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalQuizzes, totalAttempts, categories] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Quiz.countDocuments(),
      Attempt.countDocuments({ status: 'submitted' }),
      Category.countDocuments({ isPublished: true }),
    ]);

    const avgScoreResult = await Attempt.aggregate([
      { $match: { status: 'submitted' } },
      { $group: { _id: null, avg: { $avg: '$percentage' } } },
    ]);
    const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avg) : 0;

    // Recent 7 days attempts
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAttempts = await Attempt.aggregate([
      { $match: { status: 'submitted', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return sendSuccess(res, {
      totalUsers,
      totalQuizzes,
      totalAttempts,
      totalCategories: categories,
      avgScore,
      recentAttempts,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const [users, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, users, { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -refreshToken');
    if (!user) return sendError(res, 'User not found', 404, 'NOT_FOUND');

    return sendSuccess(res, { user }, 'User updated');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/quizzes  (with attempt stats)
const getQuizzes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [quizzes, total] = await Promise.all([
      Quiz.find()
        .populate('categoryId', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Quiz.countDocuments(),
    ]);

    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const [attemptCount, avgResult] = await Promise.all([
          Attempt.countDocuments({ quizId: quiz._id, status: 'submitted' }),
          Attempt.aggregate([
            { $match: { quizId: quiz._id, status: 'submitted' } },
            { $group: { _id: null, avg: { $avg: '$percentage' } } },
          ]),
        ]);
        return {
          ...quiz.toObject(),
          attemptCount,
          avgScore: avgResult.length > 0 ? Math.round(avgResult[0].avg) : 0,
        };
      })
    );

    return sendPaginated(res, quizzesWithStats, { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getUsers, updateUser, getQuizzes };