const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// GET /api/v1/quizzes  (public — no answers)
const getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, status = 'published', page = 1, limit = 12 } = req.query;

    const filter = { status };
    if (category) filter.categoryId = category;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const [quizzes, total] = await Promise.all([
      Quiz.find(filter)
        .populate('categoryId', 'name slug icon')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Quiz.countDocuments(filter),
    ]);

    return sendPaginated(res, quizzes, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/quizzes/:id  (public)
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('categoryId', 'name slug icon')
      .populate('createdBy', 'name');
    if (!quiz) return sendError(res, 'Quiz not found', 404, 'NOT_FOUND');
    return sendSuccess(res, { quiz });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/quizzes  [ADMIN]
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, categoryId, difficulty, duration, passingScore, instructions, status } = req.body;
    if (!title || !categoryId) {
      return sendError(res, 'Title and category are required', 400, 'VALIDATION_ERROR');
    }

    const quiz = await Quiz.create({
      title,
      description,
      categoryId,
      difficulty,
      duration,
      passingScore,
      instructions,
      status: status || 'draft',
      createdBy: req.user._id,
    });

    return sendSuccess(res, { quiz }, 'Quiz created', 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/quizzes/:id  [ADMIN]
const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) return sendError(res, 'Quiz not found', 404, 'NOT_FOUND');
    return sendSuccess(res, { quiz }, 'Quiz updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/quizzes/:id  [ADMIN]
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return sendError(res, 'Quiz not found', 404, 'NOT_FOUND');
    // Delete all questions for this quiz
    await Question.deleteMany({ quizId: req.params.id });
    return sendSuccess(res, null, 'Quiz deleted');
  } catch (err) {
    next(err);
  }
};

// ─── QUESTION MANAGEMENT ───────────────────────────────────────────────────

// GET /api/v1/quizzes/:id/questions  [ADMIN — includes correctOptionId]
const getQuestionsAdmin = async (req, res, next) => {
  try {
    const questions = await Question.find({ quizId: req.params.id }).sort({ order: 1 });
    return sendSuccess(res, { questions });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/quizzes/:id/questions/attempt  [STUDENT — NO correctOptionId]
const getQuestionsForAttempt = async (req, res, next) => {
  try {
    const QuizAttempt = require('../models/QuizAttempt');
    
    // Verify user has an active attempt for this quiz
    const attempt = await QuizAttempt.findOne({
      quizId: req.params.id,
      userId: req.user._id,
      status: 'in_progress',
    });
    
    if (!attempt) {
      return sendError(res, 'No active attempt found for this quiz', 403, 'FORBIDDEN');
    }

    const questions = await Question.find({ quizId: req.params.id })
      .select('-correctOptionId -explanation') // Hide answers
      .sort({ order: 1 });
    return sendSuccess(res, { questions });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/quizzes/:id/questions  [ADMIN]
const createQuestion = async (req, res, next) => {
  try {
    const { text, options, correctOptionId, explanation, difficulty, points, order } = req.body;
    if (!text || !options || !correctOptionId) {
      return sendError(res, 'text, options and correctOptionId are required', 400, 'VALIDATION_ERROR');
    }

    const question = await Question.create({
      quizId: req.params.id,
      text,
      options,
      correctOptionId,
      explanation,
      difficulty,
      points,
      order,
    });

    // Sync totalQuestions count on quiz
    const count = await Question.countDocuments({ quizId: req.params.id });
    await Quiz.findByIdAndUpdate(req.params.id, { totalQuestions: count });

    return sendSuccess(res, { question }, 'Question created', 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/questions/:id  [ADMIN]
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return sendError(res, 'Question not found', 404, 'NOT_FOUND');
    return sendSuccess(res, { question }, 'Question updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/questions/:id  [ADMIN]
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return sendError(res, 'Question not found', 404, 'NOT_FOUND');

    // Sync totalQuestions count
    const count = await Question.countDocuments({ quizId: question.quizId });
    await Quiz.findByIdAndUpdate(question.quizId, { totalQuestions: count });

    return sendSuccess(res, null, 'Question deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};