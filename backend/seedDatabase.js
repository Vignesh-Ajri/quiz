/**
 * Questly — Database Seed Script
 * Run: npm run seed
 *
 * Creates:
 *  - 1 Admin user
 *  - 1 Student user
 *  - 4 Categories
 *  - 3 Published Quizzes with 10 questions each
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const Attempt = require('./models/QuizAttempt');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Quiz.deleteMany({}),
    Question.deleteMany({}),
    Attempt.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // ─── Users ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const studentPassword = await bcrypt.hash('Student@123', 12);

  const [admin, student] = await User.insertMany([
    { name: 'Admin', email: 'admin@questly.com', password: adminPassword, role: 'admin' },
    { name: 'Vignesh', email: 'student@questly.com', password: studentPassword, role: 'student' },
  ]);
  console.log('👤 Users created');

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: 'Programming', slug: 'programming', description: 'Coding and software development', icon: '💻', isPublished: true },
    { name: 'JavaScript', slug: 'javascript', description: 'JavaScript language quizzes', icon: '🟨', isPublished: true },
    { name: 'Python', slug: 'python', description: 'Python programming quizzes', icon: '🐍', isPublished: true },
    { name: 'General Knowledge', slug: 'general-knowledge', description: 'GK and aptitude', icon: '🧠', isPublished: true },
  ]);
  console.log('📁 Categories created');

  const [, jsCategory, pythonCategory, gkCategory] = categories;

  // ─── Quizzes & Questions ──────────────────────────────────────────────────

  // QUIZ 1: JavaScript Basics
  const jsQuiz = await Quiz.create({
    title: 'JavaScript Basics',
    description: 'Test your fundamental JavaScript knowledge.',
    categoryId: jsCategory._id,
    difficulty: 'easy',
    duration: 15,
    passingScore: 60,
    status: 'published',
    createdBy: admin._id,
    publishedAt: new Date(),
  });

  const jsQuestions = [
    { text: 'Which keyword declares a block-scoped variable in JavaScript?', options: [{ id: 'A', text: 'var' }, { id: 'B', text: 'let' }, { id: 'C', text: 'def' }, { id: 'D', text: 'dim' }], correctOptionId: 'B', explanation: '`let` is block-scoped unlike `var` which is function-scoped.', difficulty: 'easy', points: 1, order: 1 },
    { text: 'What does `typeof null` return?', options: [{ id: 'A', text: '"null"' }, { id: 'B', text: '"undefined"' }, { id: 'C', text: '"object"' }, { id: 'D', text: '"boolean"' }], correctOptionId: 'C', explanation: 'This is a known JavaScript bug — typeof null returns "object".', difficulty: 'medium', points: 1, order: 2 },
    { text: 'Which method adds an element to the end of an array?', options: [{ id: 'A', text: 'push()' }, { id: 'B', text: 'pop()' }, { id: 'C', text: 'shift()' }, { id: 'D', text: 'unshift()' }], correctOptionId: 'A', explanation: 'push() appends to end, pop() removes from end.', difficulty: 'easy', points: 1, order: 3 },
    { text: 'What is the output of `2 + "2"` in JavaScript?', options: [{ id: 'A', text: '4' }, { id: 'B', text: '"22"' }, { id: 'C', text: 'NaN' }, { id: 'D', text: 'Error' }], correctOptionId: 'B', explanation: 'JS coerces the number to a string and concatenates.', difficulty: 'easy', points: 1, order: 4 },
    { text: 'Which of these is NOT a JavaScript data type?', options: [{ id: 'A', text: 'Symbol' }, { id: 'B', text: 'BigInt' }, { id: 'C', text: 'Float' }, { id: 'D', text: 'Boolean' }], correctOptionId: 'C', explanation: 'Float is not a JS data type. Numbers in JS are all 64-bit floats.', difficulty: 'easy', points: 1, order: 5 },
    { text: 'What does `===` check?', options: [{ id: 'A', text: 'Value only' }, { id: 'B', text: 'Type only' }, { id: 'C', text: 'Value and type' }, { id: 'D', text: 'Reference' }], correctOptionId: 'C', explanation: 'Strict equality checks both value and type.', difficulty: 'easy', points: 1, order: 6 },
    { text: 'Which function converts a JSON string to a JS object?', options: [{ id: 'A', text: 'JSON.stringify()' }, { id: 'B', text: 'JSON.parse()' }, { id: 'C', text: 'JSON.convert()' }, { id: 'D', text: 'JSON.decode()' }], correctOptionId: 'B', explanation: 'JSON.parse() converts string → object.', difficulty: 'easy', points: 1, order: 7 },
    { text: 'What is a closure in JavaScript?', options: [{ id: 'A', text: 'A way to close browser windows' }, { id: 'B', text: 'A function that remembers its outer scope' }, { id: 'C', text: 'A method to end loops' }, { id: 'D', text: 'A type of error' }], correctOptionId: 'B', explanation: 'A closure gives a function access to its outer scope even after the outer function returns.', difficulty: 'medium', points: 2, order: 8 },
    { text: 'What does the `spread` operator (...) do?', options: [{ id: 'A', text: 'Compresses an array' }, { id: 'B', text: 'Expands an iterable into individual elements' }, { id: 'C', text: 'Deletes array elements' }, { id: 'D', text: 'Merges two functions' }], correctOptionId: 'B', explanation: 'The spread operator expands iterables like arrays/objects.', difficulty: 'easy', points: 1, order: 9 },
    { text: 'Which method removes the last element from an array and returns it?', options: [{ id: 'A', text: 'push()' }, { id: 'B', text: 'shift()' }, { id: 'C', text: 'pop()' }, { id: 'D', text: 'splice()' }], correctOptionId: 'C', explanation: 'pop() removes and returns the last element.', difficulty: 'easy', points: 1, order: 10 },
  ];

  const createdJsQuestions = await Question.insertMany(jsQuestions.map(q => ({ ...q, quizId: jsQuiz._id })));
  await Quiz.findByIdAndUpdate(jsQuiz._id, { totalQuestions: createdJsQuestions.length });

  // QUIZ 2: Python Fundamentals
  const pyQuiz = await Quiz.create({
    title: 'Python Fundamentals',
    description: 'Core Python concepts and syntax.',
    categoryId: pythonCategory._id,
    difficulty: 'easy',
    duration: 15,
    passingScore: 60,
    status: 'published',
    createdBy: admin._id,
    publishedAt: new Date(),
  });

  const pyQuestions = [
    { text: 'What is the correct way to create a function in Python?', options: [{ id: 'A', text: 'function myFunc():' }, { id: 'B', text: 'def myFunc():' }, { id: 'C', text: 'create myFunc():' }, { id: 'D', text: 'func myFunc():' }], correctOptionId: 'B', explanation: 'Python uses the `def` keyword to define functions.', difficulty: 'easy', points: 1, order: 1 },
    { text: 'Which data type is immutable in Python?', options: [{ id: 'A', text: 'List' }, { id: 'B', text: 'Dictionary' }, { id: 'C', text: 'Set' }, { id: 'D', text: 'Tuple' }], correctOptionId: 'D', explanation: 'Tuples are immutable — they cannot be changed after creation.', difficulty: 'easy', points: 1, order: 2 },
    { text: 'What does `len([1, 2, 3])` return?', options: [{ id: 'A', text: '2' }, { id: 'B', text: '3' }, { id: 'C', text: '4' }, { id: 'D', text: 'Error' }], correctOptionId: 'B', explanation: 'len() returns the number of elements in a list.', difficulty: 'easy', points: 1, order: 3 },
    { text: 'How do you start a comment in Python?', options: [{ id: 'A', text: '//' }, { id: 'B', text: '/*' }, { id: 'C', text: '#' }, { id: 'D', text: '--' }], correctOptionId: 'C', explanation: 'Python uses # for single-line comments.', difficulty: 'easy', points: 1, order: 4 },
    { text: 'What is the output of `print(type([]))` in Python?', options: [{ id: 'A', text: "<class 'array'>" }, { id: 'B', text: "<class 'list'>" }, { id: 'C', text: "<class 'tuple'>" }, { id: 'D', text: "<class 'dict'>" }], correctOptionId: 'B', explanation: '[] creates an empty list.', difficulty: 'easy', points: 1, order: 5 },
    { text: 'Which keyword is used to handle exceptions in Python?', options: [{ id: 'A', text: 'catch' }, { id: 'B', text: 'except' }, { id: 'C', text: 'handle' }, { id: 'D', text: 'error' }], correctOptionId: 'B', explanation: 'Python uses try/except blocks for exception handling.', difficulty: 'easy', points: 1, order: 6 },
    { text: 'What does `range(5)` produce?', options: [{ id: 'A', text: '[1, 2, 3, 4, 5]' }, { id: 'B', text: '[0, 1, 2, 3, 4]' }, { id: 'C', text: '[0, 1, 2, 3, 4, 5]' }, { id: 'D', text: '[1, 2, 3, 4]' }], correctOptionId: 'B', explanation: 'range(5) produces 0 through 4 (5 is exclusive).', difficulty: 'easy', points: 1, order: 7 },
    { text: 'What is a lambda in Python?', options: [{ id: 'A', text: 'A class method' }, { id: 'B', text: 'An anonymous function' }, { id: 'C', text: 'A loop construct' }, { id: 'D', text: 'A module importer' }], correctOptionId: 'B', explanation: 'Lambda creates small anonymous functions inline.', difficulty: 'medium', points: 2, order: 8 },
    { text: 'How do you import a module in Python?', options: [{ id: 'A', text: 'include math' }, { id: 'B', text: 'require math' }, { id: 'C', text: 'import math' }, { id: 'D', text: 'use math' }], correctOptionId: 'C', explanation: 'Python uses the `import` statement.', difficulty: 'easy', points: 1, order: 9 },
    { text: 'Which of these creates a dictionary in Python?', options: [{ id: 'A', text: '[]' }, { id: 'B', text: '()' }, { id: 'C', text: '{}' }, { id: 'D', text: '<>' }], correctOptionId: 'C', explanation: '{} creates an empty dict. {key: value} adds entries.', difficulty: 'easy', points: 1, order: 10 },
  ];

  const createdPyQuestions = await Question.insertMany(pyQuestions.map(q => ({ ...q, quizId: pyQuiz._id })));
  await Quiz.findByIdAndUpdate(pyQuiz._id, { totalQuestions: createdPyQuestions.length });

  // QUIZ 3: General Knowledge
  const gkQuiz = await Quiz.create({
    title: 'General Knowledge Challenge',
    description: 'Test your GK with these fun questions.',
    categoryId: gkCategory._id,
    difficulty: 'medium',
    duration: 10,
    passingScore: 50,
    status: 'published',
    createdBy: admin._id,
    publishedAt: new Date(),
  });

  const gkQuestions = [
    { text: 'Which planet is known as the Red Planet?', options: [{ id: 'A', text: 'Jupiter' }, { id: 'B', text: 'Venus' }, { id: 'C', text: 'Mars' }, { id: 'D', text: 'Saturn' }], correctOptionId: 'C', explanation: 'Mars has iron oxide on its surface giving it a reddish color.', difficulty: 'easy', points: 1, order: 1 },
    { text: 'What is the capital of Japan?', options: [{ id: 'A', text: 'Seoul' }, { id: 'B', text: 'Beijing' }, { id: 'C', text: 'Osaka' }, { id: 'D', text: 'Tokyo' }], correctOptionId: 'D', explanation: 'Tokyo is the capital and largest city of Japan.', difficulty: 'easy', points: 1, order: 2 },
    { text: 'Who painted the Mona Lisa?', options: [{ id: 'A', text: 'Michelangelo' }, { id: 'B', text: 'Leonardo da Vinci' }, { id: 'C', text: 'Raphael' }, { id: 'D', text: 'Van Gogh' }], correctOptionId: 'B', explanation: 'Leonardo da Vinci painted the Mona Lisa (~1503–1519).', difficulty: 'easy', points: 1, order: 3 },
    { text: 'What is the speed of light in vacuum?', options: [{ id: 'A', text: '300,000 km/s' }, { id: 'B', text: '150,000 km/s' }, { id: 'C', text: '450,000 km/s' }, { id: 'D', text: '200,000 km/s' }], correctOptionId: 'A', explanation: 'The speed of light is approximately 299,792 km/s (~300,000 km/s).', difficulty: 'medium', points: 2, order: 4 },
    { text: 'How many bones are in the adult human body?', options: [{ id: 'A', text: '196' }, { id: 'B', text: '206' }, { id: 'C', text: '216' }, { id: 'D', text: '186' }], correctOptionId: 'B', explanation: 'An adult human body has 206 bones.', difficulty: 'medium', points: 1, order: 5 },
    { text: 'What is the chemical symbol for Gold?', options: [{ id: 'A', text: 'Go' }, { id: 'B', text: 'Gd' }, { id: 'C', text: 'Au' }, { id: 'D', text: 'Ag' }], correctOptionId: 'C', explanation: 'Au comes from the Latin word "Aurum" meaning gold.', difficulty: 'easy', points: 1, order: 6 },
    { text: 'Which country is the largest by area?', options: [{ id: 'A', text: 'USA' }, { id: 'B', text: 'China' }, { id: 'C', text: 'Canada' }, { id: 'D', text: 'Russia' }], correctOptionId: 'D', explanation: 'Russia is the largest country in the world by area at ~17 million km².', difficulty: 'easy', points: 1, order: 7 },
    { text: 'What is H₂O?', options: [{ id: 'A', text: 'Hydrogen Peroxide' }, { id: 'B', text: 'Water' }, { id: 'C', text: 'Oxygen' }, { id: 'D', text: 'Hydrochloric Acid' }], correctOptionId: 'B', explanation: 'H₂O is the molecular formula for water — 2 hydrogen atoms + 1 oxygen atom.', difficulty: 'easy', points: 1, order: 8 },
    { text: 'Who wrote "Romeo and Juliet"?', options: [{ id: 'A', text: 'Charles Dickens' }, { id: 'B', text: 'Jane Austen' }, { id: 'C', text: 'William Shakespeare' }, { id: 'D', text: 'Mark Twain' }], correctOptionId: 'C', explanation: 'Romeo and Juliet was written by William Shakespeare around 1594–96.', difficulty: 'easy', points: 1, order: 9 },
    { text: 'What is the smallest prime number?', options: [{ id: 'A', text: '0' }, { id: 'B', text: '1' }, { id: 'C', text: '2' }, { id: 'D', text: '3' }], correctOptionId: 'C', explanation: '2 is the smallest and only even prime number.', difficulty: 'easy', points: 1, order: 10 },
  ];

  const createdGkQuestions = await Question.insertMany(gkQuestions.map(q => ({ ...q, quizId: gkQuiz._id })));
  await Quiz.findByIdAndUpdate(gkQuiz._id, { totalQuestions: createdGkQuestions.length });

  console.log('📝 Quizzes and questions created');

  console.log('\n✅ Database seeded successfully!\n');
  console.log('─────────────────────────────────────');
  console.log('🔑 Admin Login:');
  console.log('   Email:    admin@questly.com');
  console.log('   Password: Admin@123');
  console.log('');
  console.log('👤 Student Login:');
  console.log('   Email:    student@questly.com');
  console.log('   Password: Student@123');
  console.log('─────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});