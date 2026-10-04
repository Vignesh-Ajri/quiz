const Attempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/v1/quizzes/:id/attempts   — Start a new attempt
const startAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return sendError(res, 'Quiz not found', 404, 'NOT_FOUND');
    if (quiz.status !== 'published') return sendError(res, 'Quiz is not available', 403, 'FORBIDDEN');

    // Check for existing in-progress attempt
    const existing = await Attempt.findOne({
      userId: req.user._id,
      quizId: quiz._id,
      status: 'in_progress',
    });
    if (existing) {
      // Return the existing attempt so student can resume
      return sendSuccess(res, { attempt: existing }, 'Resuming existing attempt');
    }

    // Fetch questions
    const questions = await Question.find({ quizId: quiz._id }).sort({ order: 1 });
    if (questions.length === 0) return sendError(res, 'Quiz has no questions', 400, 'NO_QUESTIONS');

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    // Build empty answers array
    const answers = questions.map((q) => ({
      questionId: q._id,
      selectedOptionId: null,
      isCorrect: false,
      timeSpent: 0,
    }));

    const startedAt = new Date();
    const expiresAt = quiz.duration > 0
      ? new Date(startedAt.getTime() + quiz.duration * 60 * 1000)
      : null;

    const attempt = await Attempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      questionIds: questions.map((q) => q._id),
      answers,
      totalPoints,
      startedAt,
      expiresAt,
    });

    return sendSuccess(res, { attempt }, 'Attempt started', 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/attempts/:id/answer   — Save a single answer (autosave)
const saveAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOptionId } = req.body;
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) return sendError(res, 'Attempt not found', 404, 'NOT_FOUND');
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized', 403, 'FORBIDDEN');
    }
    if (attempt.status !== 'in_progress') {
      return sendError(res, 'Attempt already submitted', 400, 'ATTEMPT_CLOSED');
    }

    // Check expiry
    if (attempt.expiresAt && new Date() > attempt.expiresAt) {
      attempt.status = 'expired';
      await attempt.save();
      return sendError(res, 'Attempt has expired', 400, 'ATTEMPT_EXPIRED');
    }

    // Update the answer for this question
    const answerIndex = attempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId
    );
    if (answerIndex === -1) return sendError(res, 'Question not found in attempt', 400, 'INVALID_QUESTION');

    attempt.answers[answerIndex].selectedOptionId = selectedOptionId;
    attempt.markModified('answers');
    await attempt.save();

    return sendSuccess(res, null, 'Answer saved');
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/attempts/:id/submit   — Submit and score the attempt
const submitAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id);
    if (!attempt) return sendError(res, 'Attempt not found', 404, 'NOT_FOUND');
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized', 403, 'FORBIDDEN');
    }
    if (attempt.status !== 'in_progress') {
      return sendError(res, 'Attempt already submitted or expired', 400, 'ATTEMPT_CLOSED');
    }

    // Check expiry
    const now = new Date();
    if (attempt.expiresAt && now > attempt.expiresAt) {
      attempt.status = 'expired';
    } else {
      attempt.status = 'submitted';
    }

    // Fetch correct answers from DB (never from client)
    const questions = await Question.find({ _id: { $in: attempt.questionIds } });
    const questionMap = {};
    questions.forEach((q) => { questionMap[q._id.toString()] = q; });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    attempt.answers = attempt.answers.map((ans) => {
      const question = questionMap[ans.questionId.toString()];
      if (!question) return ans;

      if (!ans.selectedOptionId) {
        skippedCount++;
        ans.isCorrect = false;
        return ans;
      }

      const isCorrect = ans.selectedOptionId === question.correctOptionId;
      ans.isCorrect = isCorrect;

      if (isCorrect) {
        score += question.points;
        correctCount++;
      } else {
        wrongCount++;
      }
      return ans;
    });

    const quiz = await Quiz.findById(attempt.quizId);
    const percentage = attempt.totalPoints > 0
      ? Math.round((score / attempt.totalPoints) * 100)
      : 0;

    attempt.score = score;
    attempt.percentage = percentage;
    attempt.correctCount = correctCount;
    attempt.wrongCount = wrongCount;
    attempt.skippedCount = skippedCount;
    attempt.isPassed = percentage >= (quiz?.passingScore || 60);
    attempt.submittedAt = now;
    attempt.timeSpent = Math.floor((now - attempt.startedAt) / 1000);
    attempt.markModified('answers');

    await attempt.save();

    // Build result with question details + correct answers (now safe to reveal)
    const questionsWithAnswers = questions.map((q) => {
      const userAnswer = attempt.answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );
      return {
        _id: q._id,
        text: q.text,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        points: q.points,
        userAnswer: userAnswer?.selectedOptionId || null,
        isCorrect: userAnswer?.isCorrect || false,
      };
    });

    return sendSuccess(res, {
      attempt: {
        _id: attempt._id,
        status: attempt.status,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        percentage: attempt.percentage,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        skippedCount: attempt.skippedCount,
        isPassed: attempt.isPassed,
        timeSpent: attempt.timeSpent,
        submittedAt: attempt.submittedAt,
      },
      questions: questionsWithAnswers,
    }, 'Quiz submitted successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/attempts/:id   — Get attempt result (post-submit)
const getAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate('quizId', 'title difficulty passingScore');
    if (!attempt) return sendError(res, 'Attempt not found', 404, 'NOT_FOUND');
    if (attempt.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized', 403, 'FORBIDDEN');
    }

    if (attempt.status === 'submitted') {
      // Fetch question details with answers revealed
      const questions = await Question.find({ _id: { $in: attempt.questionIds } });
      const questionsWithAnswers = questions.map((q) => {
        const userAnswer = attempt.answers.find(
          (a) => a.questionId.toString() === q._id.toString()
        );
        return {
          _id: q._id,
          text: q.text,
          options: q.options,
          correctOptionId: q.correctOptionId,
          explanation: q.explanation,
          points: q.points,
          userAnswer: userAnswer?.selectedOptionId || null,
          isCorrect: userAnswer?.isCorrect || false,
        };
      });
      return sendSuccess(res, { attempt, questions: questionsWithAnswers });
    }

    return sendSuccess(res, { attempt });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/me/attempts  — Student history
const getMyAttempts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [attempts, total] = await Promise.all([
      Attempt.find({ userId: req.user._id, status: { $ne: 'in_progress' } })
        .populate('quizId', 'title difficulty categoryId thumbnail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Attempt.countDocuments({ userId: req.user._id, status: { $ne: 'in_progress' } }),
    ]);

    return sendSuccess(res, {
      attempts,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/me/stats  — Student stats for dashboard
const getMyStats = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id, status: 'submitted' });
    const totalAttempts = attempts.length;

    if (totalAttempts === 0) {
      return sendSuccess(res, {
        totalAttempts: 0,
        avgScore: 0,
        avgAccuracy: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalSkipped: 0,
        passRate: 0,
      });
    }

    const totalCorrect = attempts.reduce((s, a) => s + a.correctCount, 0);
    const totalWrong = attempts.reduce((s, a) => s + a.wrongCount, 0);
    const totalSkipped = attempts.reduce((s, a) => s + a.skippedCount, 0);
    const totalAnswered = totalCorrect + totalWrong;
    const avgAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const avgScore = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts);
    const passedCount = attempts.filter((a) => a.isPassed).length;
    const passRate = Math.round((passedCount / totalAttempts) * 100);

    return sendSuccess(res, {
      totalAttempts,
      avgScore,
      avgAccuracy,
      totalCorrect,
      totalWrong,
      totalSkipped,
      passRate,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const leaderboard = await Attempt.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$userId',
          totalAttempts: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' },
          totalScore: { $sum: '$score' },
          bestScore: { $max: '$percentage' },
        },
      },
      { $sort: { avgPercentage: -1, totalScore: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          avatar: '$user.avatar',
          totalAttempts: 1,
          avgPercentage: { $round: ['$avgPercentage', 1] },
          totalScore: 1,
          bestScore: 1,
        },
      },
    ]);

    return sendSuccess(res, { leaderboard });
  } catch (err) {
    next(err);
  }
};

module.exports = { startAttempt, saveAnswer, submitAttempt, getAttempt, getMyAttempts, getMyStats, getLeaderboard };
