const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const QuizAttempt = require('../models/QuizAttempt');

// ===============================
// USER MANAGEMENT
// ===============================

// Get all users with statistics
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const attempts = await QuizAttempt.find({ userId: user._id });
        const quizzesAttempted = attempts.length;
        const averageScore =
          attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                  attempts.length
              )
            : 0;

        return {
          ...user.toObject(),
          quizzesAttempted,
          averageScore,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all quiz attempts by this user
    await QuizAttempt.deleteMany({ userId: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// QUIZ MANAGEMENT
// ===============================

// Get all quizzes with statistics
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('category', 'name');

    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await QuizAttempt.find({ quizId: quiz._id });
        const totalAttempts = attempts.length;
        const averageScore =
          attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                  attempts.length
              )
            : 0;

        return {
          ...quiz.toObject(),
          attempts: totalAttempts,
          averageScore,
          questions: quiz.questions.length,
        };
      })
    );

    res.json(quizzesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new quiz
const createQuiz = async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single quiz
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete all attempts for this quiz
    await QuizAttempt.deleteMany({ quizId: req.params.id });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// CATEGORY MANAGEMENT
// ===============================

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid category ID' });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: 'Category already exists' });

    const category = await Category.create({ name, isActive });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    category.name = name || category.name;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid category ID' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid category ID' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllQuizzes,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}