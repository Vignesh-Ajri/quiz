const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('-questions.options.isCorrect')
      .populate('createdBy', 'name')
      .populate('category', 'name')
      .sort('-createdAt');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.options.isCorrect')
      .populate('createdBy', 'name');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quiz Attempt Routes
const attemptQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const attempt = new QuizAttempt({
      userId: req.user._id,
      quizId: quiz._id,
      totalScore: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      score: 0,
      percentage: 0
    });

    await attempt.save();
    res.status(201).json(attempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await QuizAttempt.findById(req.params.id);
    
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    let score = 0;
    const processedAnswers = [];

    // Process each answer
    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const correctOption = question.options.find(opt => opt.isCorrect);
      const isCorrect = answer.selectedOption === correctOption.text;
      
      processedAnswers.push({
        questionId: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        points: isCorrect ? question.points : 0,
        timeSpent: answer.timeSpent || 0
      });

      if (isCorrect) {
        score += question.points;
      }
    });

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.percentage = Math.round((score / attempt.totalScore) * 100);
    attempt.status = 'completed';
    attempt.endTime = new Date();

    await attempt.save();

    // Populate the attempt with quiz details for response
    await attempt.populate('quizId', 'title description');
    
    res.json(attempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate('quizId')
      .populate('userId', 'name email');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    attemptQuiz,
    submitAttempt,
    getAttemptById
}