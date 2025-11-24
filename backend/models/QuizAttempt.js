const mongoose = require('mongoose');

const attemptAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [attemptAnswerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Calculate attempt number before saving
quizAttemptSchema.pre('save', async function(next) {
  if (this.isNew) {
    const attemptCount = await this.constructor.countDocuments({
      userId: this.userId,
      quizId: this.quizId
    });
    this.attemptNumber = attemptCount + 1;
  }
  
  // Calculate duration if endTime is set
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  
  next();
});

// Index for better query performance
quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);