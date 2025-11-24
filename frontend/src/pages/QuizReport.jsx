import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import {
  Trophy,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  Share2,
  Award,
  TrendingUp,
} from "lucide-react";

const QuizReport = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchAttemptData();
  }, [attemptId]);

  const fetchAttemptData = async () => {
    try {
      const response = await api.get(`/api/quizzes/attempts/${attemptId}`);
      const attemptData = response.data;
      setAttempt(attemptData);
      setQuiz(attemptData.quizId);
    } catch (error) {
      console.error("Error fetching attempt data:", error);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding! 🎉";
    if (percentage >= 80) return "Excellent work! 👏";
    if (percentage >= 70) return "Good job! 👍";
    if (percentage >= 60) return "Not bad, keep practicing! 💪";
    if (percentage >= 40) return "You can do better! 📚";
    return "Keep studying and try again! 🤓";
  };

  const retakeQuiz = async () => {
    try {
      const response = await api.post(`/api/quizzes/${quiz._id}/attempt`);

      toast.success("New quiz attempt started!");
      navigate(`/quiz/${quiz._id}?attempt=${response.data._id}`);
    } catch (error) {
      console.error("Error starting new attempt:", error);

      toast.error("Failed to start a new attempt. Please try again.");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!attempt || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Report not found
          </h2>
          <button
            onClick={() => navigate("/home")}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            <Trophy className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <div
              className={`text-6xl font-bold mb-2 ${getScoreColor(
                attempt.percentage
              )}`}
            >
              {attempt.percentage}%
            </div>
            <p className="text-xl text-gray-600 mb-2">
              {getScoreMessage(attempt.percentage)}
            </p>
            <p className="text-gray-500">
              You scored {attempt.score} out of {attempt.totalScore} points
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {attempt.answers.filter((a) => a.isCorrect).length}/
                {quiz.questions.length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {attempt.duration ? formatDuration(attempt.duration) : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                #{attempt.attemptNumber}
              </div>
              <div className="text-sm text-gray-600">Attempt Number</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </button>

            <button
              onClick={retakeQuiz}
              className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake Quiz
            </button>

            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              {showAnswers ? "Hide" : "Review"} Answers
            </button>
          </div>
        </div>

        {/* Detailed Answers */}
        {showAnswers && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Answer Review
            </h2>

            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers.find(
                  (a) => a.questionId === question._id
                );
                const correctOption = question.options.find(
                  (opt) => opt.isCorrect
                );
                const isCorrect = userAnswer?.isCorrect;

                return (
                  <div
                    key={question._id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800 flex-1 pr-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">
                              Incorrect
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIndex) => {
                        let optionClass = "p-3 rounded-lg border ";

                        if (option.isCorrect) {
                          optionClass +=
                            "bg-green-50 border-green-200 text-green-800";
                        } else if (
                          userAnswer?.selectedOption === option.text &&
                          !option.isCorrect
                        ) {
                          optionClass +=
                            "bg-red-50 border-red-200 text-red-800";
                        } else {
                          optionClass +=
                            "bg-gray-50 border-gray-200 text-gray-700";
                        }

                        return (
                          <div key={optIndex} className={optionClass}>
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              <div className="flex items-center space-x-2">
                                {option.isCorrect && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Correct
                                  </span>
                                )}
                                {userAnswer?.selectedOption === option.text && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                          Explanation:
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {question.explanation}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 text-right">
                      <span className="text-sm text-gray-600">
                        Points: {isCorrect ? question.points : 0}/
                        {question.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Performance Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Category Performance
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{quiz.category}</span>
                  <span
                    className={`font-semibold ${getScoreColor(
                      attempt.percentage
                    )}`}
                  >
                    {attempt.percentage}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Difficulty Level
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{quiz.difficulty}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : quiz.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReport;
