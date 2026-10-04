const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: [
      {
        id: { type: String, required: true }, // 'A', 'B', 'C', 'D'
        text: { type: String, required: true, trim: true },
      },
    ],
    correctOptionId: {
      type: String,
      required: [true, 'Correct option is required'],
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// IMPORTANT: correctOptionId is never sent to student clients
// It is fetched only by the server when scoring an attempt
questionSchema.index({ quizId: 1, order: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
